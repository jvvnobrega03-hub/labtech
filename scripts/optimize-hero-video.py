"""Transcode a Hero video with Blender's bundled FFmpeg.

Run with Blender in background mode and pass arguments after ``--``:
blender --background -F FFMPEG --python scripts/optimize-hero-video.py -- \
  input.mp4 output.mp4 1600 900 mp4
"""

from __future__ import annotations

import glob
import os
import sys

import bpy


def main() -> None:
    try:
        separator = sys.argv.index("--")
        source, output, width, height, container = sys.argv[separator + 1 : separator + 6]
    except (ValueError, IndexError) as error:
        raise SystemExit("Expected: input output width height mp4|webm") from error

    width_px = int(width)
    height_px = int(height)
    if container not in {"mp4", "webm"}:
        raise SystemExit("Container must be mp4 or webm")

    scene = bpy.context.scene
    editor = scene.sequence_editor_create()
    strip = editor.strips.new_movie("hero-source", source, channel=1, frame_start=1)

    source_width = strip.elements[0].orig_width
    source_height = strip.elements[0].orig_height
    strip.transform.scale_x = width_px / source_width
    strip.transform.scale_y = height_px / source_height

    scene.frame_start = 1
    scene.frame_end = strip.frame_duration
    scene.render.fps = round(strip.fps)
    scene.render.resolution_x = width_px
    scene.render.resolution_y = height_px
    scene.render.resolution_percentage = 100
    scene.render.image_settings.color_mode = "RGB"
    scene.render.ffmpeg.format = "MPEG4" if container == "mp4" else "WEBM"
    scene.render.ffmpeg.codec = "H264" if container == "mp4" else "WEBM"
    scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    scene.render.ffmpeg.ffmpeg_preset = "GOOD"
    scene.render.ffmpeg.gopsize = 48
    scene.render.ffmpeg.use_max_b_frames = True
    scene.render.ffmpeg.max_b_frames = 2
    scene.render.ffmpeg.audio_codec = "NONE"

    output = os.path.abspath(output)
    os.makedirs(os.path.dirname(output), exist_ok=True)
    stem, extension = os.path.splitext(output)
    scene.render.filepath = stem
    bpy.ops.render.render(animation=True)

    generated = sorted(glob.glob(f"{stem}*{extension}"), key=os.path.getmtime, reverse=True)
    if not generated:
        raise SystemExit(f"Blender did not create {extension} output")
    if os.path.abspath(generated[0]) != output:
        os.replace(generated[0], output)


if __name__ == "__main__":
    main()
