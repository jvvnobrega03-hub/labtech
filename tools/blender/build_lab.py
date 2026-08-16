"""Procedural premium clinical laboratory environment."""

from __future__ import annotations

import bpy

from common import collection, cube, cylinder, empty, look_at, material, move_to_collection


def build_lab() -> dict[str, bpy.types.Object]:
    lab = collection("LAB_Environment")
    white = material("MAT_Lab_White", (0.72, 0.80, 0.84, 1.0), roughness=0.28)
    graphite = material("MAT_Lab_Graphite", (0.025, 0.045, 0.055, 1.0), metallic=0.25, roughness=0.24)
    steel = material("MAT_Lab_Steel", (0.30, 0.38, 0.42, 1.0), metallic=0.8, roughness=0.2)
    cyan = material(
        "MAT_Lab_Cyan",
        (0.03, 0.45, 0.58, 1.0),
        roughness=0.18,
        emission=(0.02, 0.50, 0.68, 1.0),
        emission_strength=2.2,
    )

    floor = cube("Lab_Floor", (0.0, 0.0, -0.12), (7.5, 6.0, 0.12), graphite, bevel_width=0.02, owner=lab)
    cube("Lab_Back_Wall", (0.0, 3.4, 2.6), (7.5, 0.10, 2.7), white, bevel_width=0.02, owner=lab)
    cube("Lab_Left_Wall", (-7.3, 0.0, 2.6), (0.10, 3.5, 2.7), white, bevel_width=0.02, owner=lab)
    cube("Lab_Ceiling", (0.0, 0.0, 5.25), (7.5, 3.5, 0.10), graphite, bevel_width=0.02, owner=lab)

    for row, y in enumerate((2.45, 1.85)):
        for index, x in enumerate((-4.7, -2.6, 3.7, 5.5)):
            cube(f"Lab_Bench_{row}_{index}", (x, y, 0.72), (0.82, 0.46, 0.72), white, owner=lab)
            cube(f"Lab_BenchTop_{row}_{index}", (x, y, 1.48), (0.88, 0.50, 0.055), steel, owner=lab)
            screen = cube(f"Lab_Screen_{row}_{index}", (x, y - 0.20, 2.0), (0.33, 0.055, 0.24), graphite, owner=lab)
            screen.rotation_euler.x = 0.08
            cube(f"Lab_ScreenGlow_{row}_{index}", (x, y - 0.252, 2.0), (0.27, 0.01, 0.17), cyan, bevel_width=0.01, owner=lab)

    for index, x in enumerate((-5.4, -2.7, 0.0, 2.7, 5.4)):
        cube(f"Ceiling_Light_{index}", (x, 0.2, 5.08), (0.80, 0.28, 0.025), cyan, bevel_width=0.01, owner=lab)

    for index, x in enumerate((-4.4, -1.6, 1.5, 4.4)):
        column = cylinder(f"Lab_Column_{index}", (x, 3.18, 2.55), 0.08, 5.0, steel, owner=lab)
        column.rotation_euler.z = 0.0

    world = bpy.context.scene.world or bpy.data.worlds.new("Labtech_World")
    bpy.context.scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background:
        background.inputs["Color"].default_value = (0.007, 0.015, 0.020, 1.0)
        background.inputs["Strength"].default_value = 0.22

    key = bpy.data.lights.new("Key_Softbox", type="AREA")
    key.energy = 1350
    key.shape = "RECTANGLE"
    key.size = 5.0
    key.color = (0.82, 0.93, 1.0)
    key_obj = bpy.data.objects.new("Key_Softbox", key)
    key_obj.location = (-1.6, -3.4, 5.1)
    lab.objects.link(key_obj)
    look_at(key_obj, (0.7, 0.0, 1.1))

    fill = bpy.data.lights.new("Fill_Softbox", type="AREA")
    fill.energy = 650
    fill.size = 4.0
    fill.color = (0.45, 0.72, 0.80)
    fill_obj = bpy.data.objects.new("Fill_Softbox", fill)
    fill_obj.location = (4.8, -1.6, 3.2)
    lab.objects.link(fill_obj)
    look_at(fill_obj, (0.8, 0.0, 1.3))

    rim = bpy.data.lights.new("Cyan_Rim", type="AREA")
    rim.energy = 900
    rim.size = 2.4
    rim.color = (0.04, 0.72, 1.0)
    rim_obj = bpy.data.objects.new("Cyan_Rim", rim)
    rim_obj.location = (2.8, 2.7, 3.8)
    lab.objects.link(rim_obj)
    look_at(rim_obj, (0.9, 0.0, 1.4))

    camera_data = bpy.data.cameras.new("Hero_Camera")
    camera_data.lens = 52
    camera_data.sensor_width = 36
    camera = bpy.data.objects.new("Hero_Camera", camera_data)
    camera.location = (7.2, -10.5, 4.15)
    lab.objects.link(camera)
    look_at(camera, (0.45, 0.0, 1.35))
    bpy.context.scene.camera = camera

    environment = empty("Lab_Environment", (0.0, 0.0, 0.0), owner=lab)
    environment["deterministic_scene"] = True
    return {
        "environment": environment,
        "floor": floor,
        "camera": camera,
        "key": key_obj,
        "fill": fill_obj,
        "rim": rim_obj,
    }
