"""Procedural professional centrifuge and test-tube assembly."""

from __future__ import annotations

import math

import bpy

from common import assign, collection, cube, cylinder, empty, material, parent, radians, torus


CENTRIFUGE_CENTER = (0.80, 0.0, 0.0)
ROTOR_Z = 1.42
TUBE_Z = 1.78
TUBE_COUNT = 10
INTERACTIVE_INDEX = 9


def _tube_materials() -> tuple[bpy.types.Material, bpy.types.Material, bpy.types.Material]:
    glass = material(
        "MAT_Tube_Glass",
        (0.72, 0.92, 0.98, 0.28),
        roughness=0.08,
        transmission=0.9,
        alpha=0.32,
    )
    cap = material("MAT_Tube_Cap", (0.02, 0.34, 0.48, 1.0), metallic=0.05, roughness=0.22)
    liquid = material(
        "MAT_Tube_Liquid",
        (0.83, 0.34, 0.05, 0.82),
        roughness=0.12,
        transmission=0.12,
        alpha=0.88,
    )
    return glass, cap, liquid


def _build_tube(
    name: str,
    location: tuple[float, float, float],
    owner: bpy.types.Collection,
    *,
    interactive: bool = False,
) -> bpy.types.Object:
    glass, cap, liquid = _tube_materials()
    root = empty(name, location, display_size=0.08, owner=owner)
    body = cylinder(f"{name}_Glass", (location[0], location[1], location[2] + 0.02), 0.055, 0.42, glass, vertices=48, bevel_width=0.012, owner=owner)
    fluid = cylinder(f"{name}_Liquid", (location[0], location[1], location[2] - 0.075), 0.044, 0.18, liquid, vertices=48, bevel_width=0.005, owner=owner)
    tube_cap = cylinder(f"{name}_Cap", (location[0], location[1], location[2] + 0.245), 0.066, 0.07, cap, vertices=48, bevel_width=0.008, owner=owner)
    for part in (body, fluid, tube_cap):
        parent(part, root)
    root["interactive"] = interactive
    root["initial_location"] = tuple(location)
    return root


def build_centrifuge() -> dict[str, bpy.types.Object]:
    assembly = collection("CENTRIFUGE_Assembly")
    white = material("MAT_Medical_White", (0.84, 0.90, 0.92, 1.0), roughness=0.22)
    graphite = material("MAT_Graphite", (0.025, 0.040, 0.048, 1.0), metallic=0.28, roughness=0.20)
    aluminum = material("MAT_Brushed_Aluminum", (0.40, 0.48, 0.52, 1.0), metallic=0.86, roughness=0.24)
    anodized = material("MAT_Anodized_Rotor", (0.045, 0.075, 0.090, 1.0), metallic=0.90, roughness=0.18)
    cyan = material(
        "MAT_Internal_Cyan",
        (0.02, 0.42, 0.58, 1.0),
        roughness=0.18,
        emission=(0.02, 0.55, 0.72, 1.0),
        emission_strength=2.7,
    )
    glass = material(
        "MAT_Lid_Glass",
        (0.55, 0.82, 0.90, 0.18),
        roughness=0.06,
        transmission=0.94,
        alpha=0.22,
    )

    body = cube("Centrifuge_Body", (0.80, 0.0, 0.72), (1.18, 0.95, 0.70), white, bevel_width=0.16, owner=assembly)
    cube("Centrifuge_Base_Trim", (0.80, 0.0, 0.20), (1.12, 0.90, 0.15), graphite, bevel_width=0.08, owner=assembly)
    chamber = cylinder("Centrifuge_Chamber", (0.80, 0.0, 1.33), 0.82, 0.20, graphite, vertices=96, bevel_width=0.03, owner=assembly)
    torus("Centrifuge_Chamber_Rim", (0.80, 0.0, 1.47), 0.77, 0.055, aluminum, owner=assembly)

    rotor = cylinder("Centrifuge_Rotor", (0.80, 0.0, ROTOR_Z), 0.66, 0.20, anodized, vertices=96, bevel_width=0.035, owner=assembly)
    rotor["stationary_during_robot_loop"] = True
    cylinder("Rotor_Holders", (0.80, 0.0, ROTOR_Z + 0.12), 0.52, 0.10, aluminum, vertices=96, bevel_width=0.02, owner=assembly)
    cylinder("Rotor_Hub", (0.80, 0.0, ROTOR_Z + 0.20), 0.13, 0.16, graphite, vertices=64, bevel_width=0.02, owner=assembly)

    tube_socket_target: bpy.types.Object | None = None
    interactive_tube: bpy.types.Object | None = None
    radius = 0.47
    for index in range(TUBE_COUNT):
        angle = radians(-30 + index * (360 / TUBE_COUNT))
        x = CENTRIFUGE_CENTER[0] + math.cos(angle) * radius
        y = CENTRIFUGE_CENTER[1] + math.sin(angle) * radius
        torus(f"Tube_Socket_{index + 1:02d}", (x, y, ROTOR_Z + 0.22), 0.072, 0.018, graphite, owner=assembly)
        if index == INTERACTIVE_INDEX:
            tube_socket_target = empty("Tube_Socket_Target", (x, y, TUBE_Z), display_size=0.10, owner=assembly)
            interactive_tube = _build_tube("Tube_Interactive", (x, y, TUBE_Z), assembly, interactive=True)
            tube_to_rotor = interactive_tube.constraints.new(type="CHILD_OF")
            tube_to_rotor.name = "TubeToRotor"
            tube_to_rotor.target = tube_socket_target
            tube_to_rotor.inverse_matrix = tube_socket_target.matrix_world.inverted()
            tube_to_rotor.influence = 1.0
        else:
            _build_tube(f"Tube_Static_{index + 1:02d}", (x, y, TUBE_Z), assembly)

    panel = cube("Control_Panel", (0.80, -0.90, 0.79), (0.53, 0.055, 0.25), graphite, bevel_width=0.045, owner=assembly)
    panel.rotation_euler.x = radians(-8)
    display = cube("Control_Panel_Display", (0.80, -0.955, 0.80), (0.34, 0.012, 0.12), cyan, bevel_width=0.012, owner=assembly)
    display.rotation_euler.x = radians(-8)
    cylinder("Locking_System", (0.80, -0.72, 1.58), 0.09, 0.16, aluminum, vertices=48, rotation=(radians(90), 0.0, 0.0), owner=assembly)

    hinge = cylinder("Hinge", (0.80, 0.87, 1.69), 0.09, 0.72, aluminum, vertices=64, rotation=(0.0, radians(90), 0.0), owner=assembly)
    lid = empty("Centrifuge_Lid", (0.80, 0.87, 1.69), display_size=0.16, owner=assembly)
    lid["closed_angle"] = 0.0
    lid["open_angle"] = radians(-76)
    lid_ring = torus("Centrifuge_Lid_Frame", (0.80, 0.0, 1.69), 0.78, 0.075, white, owner=assembly)
    lid_glass = cylinder("Centrifuge_Glass", (0.80, 0.0, 1.69), 0.70, 0.045, glass, vertices=96, bevel_width=0.02, owner=assembly)
    for part in (lid_ring, lid_glass):
        parent(part, lid)

    if not tube_socket_target or not interactive_tube:
        raise RuntimeError("Interactive tube assembly was not created")

    body["medical_device"] = "centrifuge"
    return {
        "body": body,
        "chamber": chamber,
        "rotor": rotor,
        "lid": lid,
        "glass": lid_glass,
        "hinge": hinge,
        "panel": panel,
        "tube": interactive_tube,
        "socket": tube_socket_target,
    }
