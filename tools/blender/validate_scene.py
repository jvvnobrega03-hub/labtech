"""Mechanical and temporal validation for the deterministic Labtech scene."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy

from common import OUTPUT_ROOT


TOLERANCE = 1e-4


def _matrix_values(obj: bpy.types.Object) -> tuple[float, ...]:
    return tuple(value for row in obj.matrix_world for value in row)


def _matrix_distance(first: tuple[float, ...], second: tuple[float, ...]) -> float:
    return max(abs(a - b) for a, b in zip(first, second, strict=True))


def _capture(frame: int, names: list[str]) -> dict[str, tuple[float, ...]]:
    scene = bpy.context.scene
    scene.frame_set(frame)
    bpy.context.view_layer.update()
    return {name: _matrix_values(bpy.data.objects[name]) for name in names}


def validate_scene(*, raise_on_error: bool = True) -> dict[str, object]:
    scene = bpy.context.scene
    failures: list[str] = []
    checks: dict[str, object] = {}

    required = [
        "Centrifuge_Body",
        "Centrifuge_Lid",
        "Centrifuge_Glass",
        "Centrifuge_Rotor",
        "Rotor_Holders",
        "Tube_Socket_Target",
        "Tube_Interactive",
        "Robot_Base",
        "Robot_Shoulder",
        "Robot_UpperArm",
        "Robot_Elbow",
        "Robot_Forearm",
        "Robot_Wrist",
        "Robot_Gripper",
        "Robot_IK_Target",
        "Robot_Pole_Target",
        "Grip_Target",
        "Hero_Camera",
    ]
    missing = [name for name in required if bpy.data.objects.get(name) is None]
    checks["required_objects"] = {"missing": missing, "count": len(required)}
    if missing:
        failures.append(f"Missing required objects: {', '.join(missing)}")

    interactive_tubes = [obj for obj in bpy.data.objects if obj.name == "Tube_Interactive"]
    robot_roots = [obj for obj in bpy.data.objects if obj.get("robot_root")]
    checks["object_counts"] = {
        "interactive_tubes": len(interactive_tubes),
        "robot_roots": len(robot_roots),
        "centrifuge_bodies": sum(obj.name == "Centrifuge_Body" for obj in bpy.data.objects),
    }
    if len(interactive_tubes) != 1:
        failures.append(f"Expected exactly one Tube_Interactive, found {len(interactive_tubes)}")
    if len(robot_roots) != 1:
        failures.append(f"Expected exactly one robot root, found {len(robot_roots)}")

    if missing:
        report = {"passed": False, "failures": failures, "checks": checks}
        if raise_on_error:
            raise RuntimeError("\n".join(failures))
        return report

    robot_start = int(scene.get("robot_start", 145))
    robot_end = int(scene.get("robot_end", 288))
    loop_objects = [
        "Robot_Base",
        "Robot_Shoulder",
        "Robot_UpperArm",
        "Robot_Elbow",
        "Robot_Forearm",
        "Robot_Wrist",
        "Robot_Gripper",
        "Robot_IK_Target",
        "Robot_Pole_Target",
        "Grip_Target",
        "Tube_Interactive",
        "Hero_Camera",
        "Centrifuge_Rotor",
        "Centrifuge_Lid",
    ]
    start_state = _capture(robot_start, loop_objects)
    end_state = _capture(robot_end, loop_objects)
    loop_distances = {name: _matrix_distance(start_state[name], end_state[name]) for name in loop_objects}
    checks["loop_matrix_distances"] = loop_distances
    for name, distance in loop_distances.items():
        if distance > TOLERANCE:
            failures.append(f"{name} does not close the loop (matrix delta {distance:.6f})")

    rotor = bpy.data.objects["Centrifuge_Rotor"]
    lid = bpy.data.objects["Centrifuge_Lid"]
    rotor_states = _capture(robot_start, [rotor.name]) | _capture(190, [rotor.name]) | _capture(robot_end, [rotor.name])
    rotor_start_matrix = start_state[rotor.name]
    rotor_samples: dict[str, float] = {}
    for frame in (robot_start, 190, 240, robot_end):
        sample = _capture(frame, [rotor.name])[rotor.name]
        rotor_samples[str(frame)] = _matrix_distance(rotor_start_matrix, sample)
        if rotor_samples[str(frame)] > TOLERANCE:
            failures.append(f"Rotor moves during robotic loop at frame {frame}")
    checks["rotor_stationary"] = rotor_samples

    lid_start = _capture(robot_start, [lid.name])[lid.name]
    lid_samples: dict[str, float] = {}
    for frame in (robot_start, 190, 240, robot_end):
        sample = _capture(frame, [lid.name])[lid.name]
        lid_samples[str(frame)] = _matrix_distance(lid_start, sample)
        if lid_samples[str(frame)] > TOLERANCE:
            failures.append(f"Lid moves during robotic loop at frame {frame}")
    checks["lid_stationary"] = lid_samples

    scene.frame_set(187)
    bpy.context.view_layer.update()
    tube = bpy.data.objects["Tube_Interactive"]
    grip_target = bpy.data.objects["Grip_Target"]
    grip_distance = (tube.matrix_world.translation - grip_target.matrix_world.translation).length
    checks["grip_alignment_distance"] = grip_distance
    if grip_distance > 0.09:
        failures.append(f"Gripper is not aligned with Tube_Interactive at transfer frame ({grip_distance:.4f}m)")

    scene.frame_set(262)
    bpy.context.view_layer.update()
    socket = bpy.data.objects["Tube_Socket_Target"]
    seating_distance = (tube.matrix_world.translation - socket.matrix_world.translation).length
    checks["seating_alignment_distance"] = seating_distance
    if seating_distance > 0.02:
        failures.append(f"Tube does not return to original socket ({seating_distance:.4f}m)")

    constraints = {constraint.name: constraint.type for constraint in tube.constraints}
    checks["tube_constraints"] = constraints
    for constraint_name in ("TubeToRotor", "TubeToRobot"):
        if constraint_name not in constraints:
            failures.append(f"Missing tube ownership constraint {constraint_name}")

    scene.frame_set(1)
    report = {
        "passed": not failures,
        "failures": failures,
        "checks": checks,
        "frames": {"intro": [1, 144], "robot_loop": [145, 288]},
    }
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    report_path = OUTPUT_ROOT / "validation_report.json"
    report_path.write_text(json.dumps(report, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))

    if failures and raise_on_error:
        raise RuntimeError("Scene validation failed:\n- " + "\n- ".join(failures))
    return report


if __name__ == "__main__":
    try:
        validate_scene(raise_on_error=True)
    except Exception as exc:
        print(f"VALIDATION_ERROR: {exc}", file=sys.stderr)
        raise
