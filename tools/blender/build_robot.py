"""Deterministic compact laboratory robot with precision gripper targets."""

from __future__ import annotations

import bpy

from common import collection, cube, cylinder, empty, material, parent, radians, sphere


def build_robot() -> dict[str, bpy.types.Object]:
    robot_collection = collection("ROBOT_Assembly")
    white = material("MAT_Robot_White", (0.86, 0.91, 0.93, 1.0), roughness=0.20)
    graphite = material("MAT_Robot_Graphite", (0.025, 0.040, 0.048, 1.0), metallic=0.34, roughness=0.18)
    aluminum = material("MAT_Robot_Aluminum", (0.42, 0.50, 0.54, 1.0), metallic=0.88, roughness=0.20)
    cyan = material(
        "MAT_Robot_Status",
        (0.02, 0.44, 0.60, 1.0),
        roughness=0.14,
        emission=(0.02, 0.65, 0.86, 1.0),
        emission_strength=3.0,
    )

    base = cylinder("Robot_Base", (2.72, 0.42, 0.72), 0.43, 0.42, graphite, vertices=72, bevel_width=0.05, owner=robot_collection)
    cylinder("Robot_Base_Ring", (2.72, 0.42, 0.95), 0.35, 0.11, cyan, vertices=72, bevel_width=0.02, owner=robot_collection)

    shoulder = sphere("Robot_Shoulder", (2.72, 0.42, 1.30), 0.34, aluminum, owner=robot_collection)
    parent(shoulder, base)
    upper_arm = cube("Robot_UpperArm", (2.40, 0.32, 1.73), (0.24, 0.24, 0.62), white, bevel_width=0.18, owner=robot_collection)
    upper_arm.rotation_euler.y = radians(-28)
    parent(upper_arm, shoulder)

    elbow = sphere("Robot_Elbow", (2.12, 0.22, 2.22), 0.29, aluminum, owner=robot_collection)
    parent(elbow, upper_arm)
    forearm = cube("Robot_Forearm", (1.72, 0.12, 2.12), (0.54, 0.19, 0.20), white, bevel_width=0.15, owner=robot_collection)
    forearm.rotation_euler.y = radians(7)
    parent(forearm, elbow)

    wrist = sphere("Robot_Wrist", (1.20, 0.02, 2.00), 0.22, graphite, owner=robot_collection)
    parent(wrist, forearm)
    gripper = cube("Robot_Gripper", (1.03, -0.02, 1.79), (0.16, 0.14, 0.20), aluminum, bevel_width=0.06, owner=robot_collection)
    parent(gripper, wrist)

    jaw_left = cube("Robot_Gripper_Jaw_Left", (0.97, -0.10, 1.57), (0.035, 0.045, 0.17), graphite, bevel_width=0.018, owner=robot_collection)
    jaw_right = cube("Robot_Gripper_Jaw_Right", (1.09, -0.10, 1.57), (0.035, 0.045, 0.17), graphite, bevel_width=0.018, owner=robot_collection)
    parent(jaw_left, gripper)
    parent(jaw_right, gripper)

    ik_target = empty("Robot_IK_Target", (1.03, -0.02, 1.79), display_size=0.14, owner=robot_collection)
    pole_target = empty("Robot_Pole_Target", (2.1, -1.0, 2.4), display_size=0.16, owner=robot_collection)
    grip_target = empty("Grip_Target", (1.03, -0.02, 1.53), display_size=0.08, owner=robot_collection)
    # Keep this mechanical hand-off target in world space. It follows the
    # gripper through deterministic keyframes, avoiding scale/parent-inverse
    # drift in the tube ownership constraint.

    copy_location = gripper.constraints.new(type="COPY_LOCATION")
    copy_location.name = "Robot_IK_Position"
    copy_location.target = ik_target
    copy_location.target_space = "WORLD"
    copy_location.owner_space = "WORLD"

    tube = bpy.data.objects.get("Tube_Interactive")
    if tube is None:
        raise RuntimeError("Tube_Interactive must exist before the robot is built")
    tube_to_robot = tube.constraints.new(type="CHILD_OF")
    tube_to_robot.name = "TubeToRobot"
    tube_to_robot.target = grip_target
    tube_to_robot.influence = 0.0

    for obj in (base, shoulder, upper_arm, elbow, forearm, wrist, gripper):
        obj["robot_component"] = True
    base["robot_root"] = True
    gripper["precision_gripper"] = True

    return {
        "base": base,
        "shoulder": shoulder,
        "upper_arm": upper_arm,
        "elbow": elbow,
        "forearm": forearm,
        "wrist": wrist,
        "gripper": gripper,
        "jaw_left": jaw_left,
        "jaw_right": jaw_right,
        "ik_target": ik_target,
        "pole_target": pole_target,
        "grip_target": grip_target,
        "tube_to_robot": tube_to_robot,
    }
