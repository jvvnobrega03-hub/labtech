"""Render validated PNG sequences and encode production web video assets."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

import bpy


SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from common import FRAME_ROOT, ROOT, frame_path
from validate_scene import validate_scene


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--segment", choices=("preview", "intro", "robot", "all"), default="preview")
    parser.add_argument("--ffmpeg", default=shutil.which("ffmpeg"))
    return parser.parse_args(argv)


def set_robot_rendering(visible: bool) -> None:
    collection = bpy.data.collections.get("ROBOT_Assembly")
    if collection:
        collection.hide_render = not visible


def render_range(name: str, start: int, end: int, *, robot_visible: bool) -> Path:
    scene = bpy.context.scene
    destination = frame_path(name)
    set_robot_rendering(robot_visible)
    scene.frame_start = start
    scene.frame_end = end
    scene.render.filepath = str(destination / "frame_")
    bpy.ops.render.render(animation=True)
    return destination


def render_preview() -> Path:
    scene = bpy.context.scene
    preview = frame_path("preview")
    original_percentage = scene.render.resolution_percentage
    scene.render.resolution_percentage = 50
    for frame in (1, 90, 120, 144, 145, 187, 222, 262, 288):
        set_robot_rendering(frame >= 145)
        scene.frame_set(frame)
        scene.render.filepath = str(preview / f"preview_{frame:04d}.png")
        bpy.ops.render.render(write_still=True)
    scene.render.resolution_percentage = original_percentage
    return preview


def run(command: list[str]) -> None:
    print("RUN:", " ".join(command))
    subprocess.run(command, check=True)


def encode(ffmpeg: str) -> None:
    public_videos = ROOT / "public" / "videos"
    public_images = ROOT / "public" / "images"
    public_videos.mkdir(parents=True, exist_ok=True)
    public_images.mkdir(parents=True, exist_ok=True)

    intro_pattern = str(FRAME_ROOT / "intro" / "frame_%04d.png")
    robot_pattern = str(FRAME_ROOT / "robot" / "frame_%04d.png")
    intro_mp4 = str(public_videos / "centrifuge-intro.mp4")
    robot_mp4 = str(public_videos / "centrifuge-robot-loop.mp4")
    robot_webm = str(public_videos / "centrifuge-robot-loop.webm")
    poster = str(public_images / "centrifuge-poster.webp")

    h264 = [
        "-c:v", "libx264", "-preset", "slow", "-crf", "21",
        "-maxrate", "7M", "-bufsize", "14M", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-an",
    ]
    run([ffmpeg, "-hide_banner", "-loglevel", "error", "-framerate", "24", "-start_number", "1", "-i", intro_pattern, *h264, "-y", intro_mp4])
    run([ffmpeg, "-hide_banner", "-loglevel", "error", "-framerate", "24", "-start_number", "145", "-i", robot_pattern, *h264, "-y", robot_mp4])
    run([
        ffmpeg, "-hide_banner", "-loglevel", "error", "-framerate", "24", "-start_number", "145", "-i", robot_pattern,
        "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-row-mt", "1", "-an", "-y", robot_webm,
    ])
    run([
        ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(FRAME_ROOT / "robot" / "frame_0145.png"),
        "-frames:v", "1", "-c:v", "libwebp", "-quality", "86", "-compression_level", "5", "-y", poster,
    ])


def main() -> None:
    args = parse_args()
    validate_scene(raise_on_error=True)

    if args.segment == "preview":
        print(f"PREVIEW_READY={render_preview()}")
        return
    if args.segment in ("intro", "all"):
        render_range("intro", 1, 144, robot_visible=False)
    if args.segment in ("robot", "all"):
        render_range("robot", 145, 288, robot_visible=True)
    if args.segment == "all":
        if not args.ffmpeg:
            raise RuntimeError("FFmpeg executable is required for final encoding")
        encode(args.ffmpeg)
        print("VIDEO_ASSETS_READY")


if __name__ == "__main__":
    main()
