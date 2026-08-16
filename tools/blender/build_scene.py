"""Build and save the complete deterministic Labtech centrifuge production."""

from __future__ import annotations

import sys
from pathlib import Path

import bpy


SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from build_animation import build_animation
from build_centrifuge import build_centrifuge
from build_lab import build_lab
from build_robot import build_robot
from common import OUTPUT_ROOT, clear_scene
from validate_scene import validate_scene


def configure_render() -> None:
    scene = bpy.context.scene
    # Blender 5.2 exposes the current Eevee engine under BLENDER_EEVEE.
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.fps = 24
    scene.render.fps_base = 1.0
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 18
    scene.render.film_transparent = False
    scene.render.use_file_extension = True
    if hasattr(scene.render, "use_motion_blur"):
        scene.render.use_motion_blur = True
    if hasattr(scene.render, "motion_blur_shutter"):
        scene.render.motion_blur_shutter = 0.42
    if hasattr(scene, "eevee") and hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 64

    view = scene.view_settings
    try:
        view.look = "AgX - Medium High Contrast"
    except (TypeError, ValueError):
        pass
    view.exposure = 0.15


def build_scene() -> Path:
    clear_scene()
    configure_render()
    lab = build_lab()
    build_centrifuge()
    build_robot()
    build_animation()

    camera = lab["camera"]
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = bpy.data.objects["Centrifuge_Rotor"]
    camera.data.dof.aperture_fstop = 4.8

    report = validate_scene(raise_on_error=True)
    if not report["passed"]:
        raise RuntimeError("Scene validation did not pass")

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    blend_path = OUTPUT_ROOT / "labtech_centrifuge.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    print(f"SCENE_READY={blend_path}")
    return blend_path


if __name__ == "__main__":
    build_scene()
