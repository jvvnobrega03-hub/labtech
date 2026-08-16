"""Shared deterministic helpers for the Labtech Blender production."""

from __future__ import annotations

import math
from pathlib import Path
from typing import Iterable, Iterator

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_ROOT = ROOT / "tools" / "blender" / "output"
FRAME_ROOT = OUTPUT_ROOT / "frames"


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def collection(name: str) -> bpy.types.Collection:
    found = bpy.data.collections.get(name)
    if found:
        return found
    created = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(created)
    return created


def move_to_collection(obj: bpy.types.Object, target: bpy.types.Collection) -> None:
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    target.objects.link(obj)


def material(
    name: str,
    base_color: tuple[float, float, float, float],
    *,
    metallic: float = 0.0,
    roughness: float = 0.35,
    transmission: float = 0.0,
    alpha: float = 1.0,
    emission: tuple[float, float, float, float] | None = None,
    emission_strength: float = 0.0,
) -> bpy.types.Material:
    existing = bpy.data.materials.get(name)
    if existing:
        return existing

    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = base_color
    if alpha < 1.0 and hasattr(mat, "surface_render_method"):
        mat.surface_render_method = "DITHERED"
    principled = mat.node_tree.nodes.get("Principled BSDF")
    if principled:
        values = {
            "Base Color": base_color,
            "Metallic": metallic,
            "Roughness": roughness,
            "Alpha": alpha,
            "IOR": 1.45,
        }
        for key, value in values.items():
            if key in principled.inputs:
                principled.inputs[key].default_value = value
        for key in ("Transmission Weight", "Transmission"):
            if key in principled.inputs:
                principled.inputs[key].default_value = transmission
                break
        if emission:
            for key in ("Emission Color", "Emission"):
                if key in principled.inputs:
                    principled.inputs[key].default_value = emission
                    break
            if "Emission Strength" in principled.inputs:
                principled.inputs["Emission Strength"].default_value = emission_strength
    return mat


def assign(obj: bpy.types.Object, mat: bpy.types.Material) -> bpy.types.Object:
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.append(mat)
    return obj


def bevel(obj: bpy.types.Object, width: float, segments: int = 3) -> None:
    modifier = obj.modifiers.new(name="Precision_Bevel", type="BEVEL")
    modifier.width = width
    modifier.segments = segments


def cube(
    name: str,
    location: tuple[float, float, float],
    scale: tuple[float, float, float],
    mat: bpy.types.Material,
    *,
    bevel_width: float = 0.04,
    owner: bpy.types.Collection | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel_width:
        bevel(obj, bevel_width)
    assign(obj, mat)
    if owner:
        move_to_collection(obj, owner)
    return obj


def cylinder(
    name: str,
    location: tuple[float, float, float],
    radius: float,
    depth: float,
    mat: bpy.types.Material,
    *,
    vertices: int = 64,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
    bevel_width: float = 0.02,
    owner: bpy.types.Collection | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if bevel_width:
        bevel(obj, bevel_width, 2)
    assign(obj, mat)
    if owner:
        move_to_collection(obj, owner)
    return obj


def sphere(
    name: str,
    location: tuple[float, float, float],
    radius: float,
    mat: bpy.types.Material,
    *,
    owner: bpy.types.Collection | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    if owner:
        move_to_collection(obj, owner)
    return obj


def torus(
    name: str,
    location: tuple[float, float, float],
    major_radius: float,
    minor_radius: float,
    mat: bpy.types.Material,
    *,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
    owner: bpy.types.Collection | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=96,
        minor_segments=20,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    if owner:
        move_to_collection(obj, owner)
    return obj


def empty(
    name: str,
    location: tuple[float, float, float],
    *,
    display_size: float = 0.12,
    owner: bpy.types.Collection | None = None,
) -> bpy.types.Object:
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = display_size
    obj.location = location
    (owner or bpy.context.scene.collection).objects.link(obj)
    return obj


def parent(child: bpy.types.Object, owner: bpy.types.Object, keep_world: bool = True) -> None:
    matrix = child.matrix_world.copy()
    child.parent = owner
    if keep_world:
        child.matrix_world = matrix


def look_at(obj: bpy.types.Object, target: Iterable[float]) -> None:
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def keyframe(obj: bpy.types.Object, frame: int, *, location: bool = True, rotation: bool = True, scale: bool = False) -> None:
    if location:
        obj.keyframe_insert(data_path="location", frame=frame)
    if rotation:
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale:
        obj.keyframe_insert(data_path="scale", frame=frame)


def keyframe_value(target: object, data_path: str, frame: int) -> None:
    target.keyframe_insert(data_path=data_path, frame=frame)


def smooth_animation(objects: Iterable[bpy.types.Object]) -> None:
    for obj in objects:
        animation = obj.animation_data
        if not animation or not animation.action:
            continue
        for fcurve in iter_action_fcurves(animation.action):
            for point in fcurve.keyframe_points:
                point.interpolation = "BEZIER"
                point.handle_left_type = "AUTO_CLAMPED"
                point.handle_right_type = "AUTO_CLAMPED"


def iter_action_fcurves(action: bpy.types.Action) -> Iterator[bpy.types.FCurve]:
    """Yield curves from both legacy and Blender 5 layered actions."""
    legacy = getattr(action, "fcurves", None)
    if legacy is not None:
        yield from legacy
        return
    for layer in getattr(action, "layers", ()):
        for strip in getattr(layer, "strips", ()):
            for channelbag in getattr(strip, "channelbags", ()):
                yield from getattr(channelbag, "fcurves", ())


def frame_path(kind: str) -> Path:
    path = FRAME_ROOT / kind
    path.mkdir(parents=True, exist_ok=True)
    return path


def radians(value: float) -> float:
    return math.radians(value)
