"""Deterministic centrifuge intro and mathematically closed robotic loop."""

from __future__ import annotations

import math

import bpy
from mathutils import Vector

from common import iter_action_fcurves, keyframe, keyframe_value, radians, smooth_animation


INTRO_START = 1
INTRO_END = 144
ROBOT_START = 145
ROBOT_END = 288


def _key_constraint(constraint: bpy.types.Constraint, frame: int, influence: float) -> None:
    constraint.influence = influence
    constraint.keyframe_insert(data_path="influence", frame=frame)


def _make_constraint_switches_constant(tube: bpy.types.Object) -> None:
    animation = tube.animation_data
    if not animation or not animation.action:
        return
    for fcurve in iter_action_fcurves(animation.action):
        if "influence" not in fcurve.data_path:
            continue
        for point in fcurve.keyframe_points:
            point.interpolation = "CONSTANT"


def _animate_intro(scene: bpy.types.Scene) -> None:
    rotor = bpy.data.objects["Centrifuge_Rotor"]
    lid = bpy.data.objects["Centrifuge_Lid"]
    camera = bpy.data.objects["Hero_Camera"]
    key_light = bpy.data.objects["Key_Softbox"].data
    rim_light = bpy.data.objects["Cyan_Rim"].data

    rotor.rotation_mode = "XYZ"
    for frame, turns in ((1, 0.0), (24, 0.0), (55, 8.0), (90, 36.0), (110, 48.0), (120, 49.0), (144, 49.0)):
        rotor.rotation_euler.z = turns * math.tau
        rotor.keyframe_insert(data_path="rotation_euler", index=2, frame=frame)

    lid.rotation_mode = "XYZ"
    lid.rotation_euler.x = 0.0
    lid.keyframe_insert(data_path="rotation_euler", index=0, frame=1)
    lid.keyframe_insert(data_path="rotation_euler", index=0, frame=120)
    lid.rotation_euler.x = radians(-76)
    lid.keyframe_insert(data_path="rotation_euler", index=0, frame=138)
    lid.keyframe_insert(data_path="rotation_euler", index=0, frame=144)

    key_light.energy = 320
    key_light.keyframe_insert(data_path="energy", frame=1)
    key_light.energy = 1350
    key_light.keyframe_insert(data_path="energy", frame=24)
    rim_light.energy = 120
    rim_light.keyframe_insert(data_path="energy", frame=1)
    rim_light.energy = 900
    rim_light.keyframe_insert(data_path="energy", frame=24)

    camera.location = (7.38, -10.82, 4.26)
    keyframe(camera, 1)
    camera.location = (7.20, -10.50, 4.15)
    keyframe(camera, 144)
    keyframe(camera, ROBOT_START)
    keyframe(camera, ROBOT_END)

    smooth_animation((rotor, lid, camera))


def _animate_robot(scene: bpy.types.Scene) -> None:
    socket = bpy.data.objects["Tube_Socket_Target"]
    tube = bpy.data.objects["Tube_Interactive"]
    ik_target = bpy.data.objects["Robot_IK_Target"]
    pole_target = bpy.data.objects["Robot_Pole_Target"]
    grip_target = bpy.data.objects["Grip_Target"]
    jaw_left = bpy.data.objects["Robot_Gripper_Jaw_Left"]
    jaw_right = bpy.data.objects["Robot_Gripper_Jaw_Right"]
    shoulder = bpy.data.objects["Robot_Shoulder"]
    upper_arm = bpy.data.objects["Robot_UpperArm"]
    elbow = bpy.data.objects["Robot_Elbow"]
    forearm = bpy.data.objects["Robot_Forearm"]
    wrist = bpy.data.objects["Robot_Wrist"]
    gripper = bpy.data.objects["Robot_Gripper"]
    tube_to_rotor = tube.constraints["TubeToRotor"]
    tube_to_robot = tube.constraints["TubeToRobot"]

    socket_position = socket.matrix_world.translation.copy()
    neutral = Vector((2.22, 0.18, 2.18))
    approach = socket_position + Vector((0.0, 0.0, 0.56))
    contact = socket_position + Vector((0.0, 0.0, 0.26))
    lifted = socket_position + Vector((0.0, 0.0, 0.72))
    inspect = lifted + Vector((0.0, -0.10, 0.04))

    ik_positions = {
        145: neutral,
        155: neutral,
        175: approach,
        186: contact,
        198: contact,
        210: lifted,
        222: inspect,
        250: contact,
        261: contact,
        269: approach,
        284: neutral,
        288: neutral,
    }
    for frame, position in ik_positions.items():
        ik_target.location = position
        keyframe(ik_target, frame, rotation=False)
        grip_target.location = position + Vector((0.0, 0.0, -0.26))
        keyframe(grip_target, frame, rotation=False)

    pole_start = Vector((2.16, -1.02, 2.45))
    pole_target.location = pole_start
    keyframe(pole_target, ROBOT_START, rotation=False)
    keyframe(pole_target, ROBOT_END, rotation=False)

    initial_joint_rotations = {
        shoulder: shoulder.rotation_euler.copy(),
        upper_arm: upper_arm.rotation_euler.copy(),
        elbow: elbow.rotation_euler.copy(),
        forearm: forearm.rotation_euler.copy(),
        wrist: wrist.rotation_euler.copy(),
        gripper: gripper.rotation_euler.copy(),
    }
    approach_rotations = {
        shoulder: (radians(3), radians(-5), radians(-16)),
        upper_arm: (radians(2), radians(-37), radians(-4)),
        elbow: (radians(0), radians(24), radians(4)),
        forearm: (radians(0), radians(15), radians(0)),
        wrist: (radians(0), radians(-7), radians(0)),
        gripper: (0.0, 0.0, 0.0),
    }
    lift_rotations = {
        shoulder: (radians(2), radians(-2), radians(-12)),
        upper_arm: (radians(1), radians(-31), radians(-3)),
        elbow: (0.0, radians(18), radians(3)),
        forearm: (0.0, radians(11), 0.0),
        wrist: (0.0, radians(-5), radians(2)),
        gripper: (0.0, 0.0, radians(4)),
    }

    for obj, rotation in initial_joint_rotations.items():
        obj.rotation_euler = rotation
        keyframe(obj, ROBOT_START, location=False)
        keyframe(obj, ROBOT_END, location=False)
    for frame, pose in ((175, approach_rotations), (198, approach_rotations), (222, lift_rotations), (250, approach_rotations), (269, approach_rotations)):
        for obj, rotation in pose.items():
            obj.rotation_euler = rotation
            keyframe(obj, frame, location=False)

    left_open = jaw_left.location.copy()
    right_open = jaw_right.location.copy()
    left_closed = left_open + Vector((0.045, 0.0, 0.0))
    right_closed = right_open - Vector((0.045, 0.0, 0.0))
    for frame in (145, 181):
        jaw_left.location = left_open
        jaw_right.location = right_open
        keyframe(jaw_left, frame, rotation=False)
        keyframe(jaw_right, frame, rotation=False)
    for frame in (187, 261):
        jaw_left.location = left_closed
        jaw_right.location = right_closed
        keyframe(jaw_left, frame, rotation=False)
        keyframe(jaw_right, frame, rotation=False)
    for frame in (269, 288):
        jaw_left.location = left_open
        jaw_right.location = right_open
        keyframe(jaw_left, frame, rotation=False)
        keyframe(jaw_right, frame, rotation=False)

    scene.frame_set(187)
    bpy.context.view_layer.update()
    tube_to_robot.inverse_matrix = grip_target.matrix_world.inverted()

    _key_constraint(tube_to_rotor, 145, 1.0)
    _key_constraint(tube_to_robot, 145, 0.0)
    _key_constraint(tube_to_rotor, 187, 1.0)
    _key_constraint(tube_to_robot, 187, 0.0)
    _key_constraint(tube_to_rotor, 188, 0.0)
    _key_constraint(tube_to_robot, 188, 1.0)
    _key_constraint(tube_to_rotor, 261, 0.0)
    _key_constraint(tube_to_robot, 261, 1.0)
    _key_constraint(tube_to_rotor, 262, 1.0)
    _key_constraint(tube_to_robot, 262, 0.0)
    _key_constraint(tube_to_rotor, 288, 1.0)
    _key_constraint(tube_to_robot, 288, 0.0)

    for frame in (145, 288):
        scene.frame_set(frame)
        tube.keyframe_insert(data_path="location", frame=frame)
        tube.keyframe_insert(data_path="rotation_euler", frame=frame)

    _make_constraint_switches_constant(tube)
    smooth_animation((ik_target, grip_target, pole_target, jaw_left, jaw_right, shoulder, upper_arm, elbow, forearm, wrist, gripper))


def build_animation() -> None:
    scene = bpy.context.scene
    scene.frame_start = INTRO_START
    scene.frame_end = ROBOT_END
    scene.render.fps = 24
    scene.render.fps_base = 1.0
    scene["intro_start"] = INTRO_START
    scene["intro_end"] = INTRO_END
    scene["robot_start"] = ROBOT_START
    scene["robot_end"] = ROBOT_END
    scene["interactive_tube"] = "Tube_Interactive"

    _animate_intro(scene)
    _animate_robot(scene)
    scene.frame_set(INTRO_START)
