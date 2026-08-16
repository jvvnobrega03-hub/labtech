"""Build the real-footage Labtech intro and a stabilized seamless rotor loop.

The loop is derived only from frames in the supplied product film.  Global
camera motion is registered to a single reference frame; the final seam blends
two already-aligned six-frame windows so that only genuine rotor motion is
interpolated.
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[2]
PUBLIC_VIDEOS = ROOT / "public" / "videos"
PUBLIC_IMAGES = ROOT / "public" / "images"
LOOP_SOURCE_START = 8.70
LOOP_SOURCE_END = 10.00
SEAM_FRAMES = 6
TARGET_FPS = 24
PLAYBACK_REPETITIONS = 6
SAFE_CROP_RATIO = 0.018


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--ffmpeg", type=Path, required=True)
    return parser.parse_args()


def run(command: list[str]) -> None:
    print("RUN", " ".join(command))
    subprocess.run(command, check=True)


def load_video(path: Path) -> tuple[list[np.ndarray], float]:
    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        raise RuntimeError(f"Não foi possível abrir {path}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frames: list[np.ndarray] = []
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        frames.append(frame)
    capture.release()
    if not frames or not math.isfinite(fps) or fps <= 0:
        raise RuntimeError("O vídeo não contém frames válidos")
    return frames, fps


def full_resolution_warp(small_warp: np.ndarray, scale: float) -> np.ndarray:
    to_small = np.array(((scale, 0.0, 0.0), (0.0, scale, 0.0), (0.0, 0.0, 1.0)), dtype=np.float32)
    to_full = np.linalg.inv(to_small)
    return to_full @ small_warp @ to_small


def register_frame(frame: np.ndarray, reference: np.ndarray) -> tuple[np.ndarray, float]:
    height, width = frame.shape[:2]
    scale = 0.50
    template = cv2.resize(cv2.cvtColor(reference, cv2.COLOR_BGR2GRAY), None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    source = cv2.resize(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    template = cv2.GaussianBlur(template, (5, 5), 0)
    source = cv2.GaussianBlur(source, (5, 5), 0)

    warp = np.eye(3, dtype=np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 180, 1e-6)
    try:
        correlation, warp = cv2.findTransformECC(
            template,
            source,
            warp,
            cv2.MOTION_HOMOGRAPHY,
            criteria,
            None,
            5,
        )
    except cv2.error:
        correlation = 0.0
        warp = np.eye(3, dtype=np.float32)

    registered = cv2.warpPerspective(
        frame,
        full_resolution_warp(warp, scale),
        (width, height),
        flags=cv2.INTER_LANCZOS4 | cv2.WARP_INVERSE_MAP,
        borderMode=cv2.BORDER_REFLECT_101,
    )
    margin_x = max(2, round(width * SAFE_CROP_RATIO))
    margin_y = max(2, round(height * SAFE_CROP_RATIO))
    registered = registered[margin_y : height - margin_y, margin_x : width - margin_x]
    registered = cv2.resize(registered, (width, height), interpolation=cv2.INTER_LANCZOS4)
    return registered, float(correlation)


def smoothstep(value: float) -> float:
    return value * value * (3.0 - 2.0 * value)


def build_loop(frames: list[np.ndarray], fps: float) -> tuple[list[np.ndarray], dict[str, object]]:
    start = round(LOOP_SOURCE_START * fps)
    end = min(len(frames), round(LOOP_SOURCE_END * fps))
    segment = frames[start:end]
    if len(segment) < SEAM_FRAMES * 3:
        raise RuntimeError("Trecho final insuficiente para construir o loop")

    reference_index = SEAM_FRAMES
    reference = segment[reference_index]
    stabilized: list[np.ndarray] = []
    correlations: list[float] = []
    for frame in segment:
        registered, correlation = register_frame(frame, reference)
        stabilized.append(registered)
        correlations.append(correlation)

    middle = stabilized[SEAM_FRAMES : -SEAM_FRAMES]
    tail = stabilized[-SEAM_FRAMES:]
    head = stabilized[:SEAM_FRAMES]
    seam: list[np.ndarray] = []
    for index, (tail_frame, head_frame) in enumerate(zip(tail, head, strict=True)):
        amount = smoothstep((index + 1) / SEAM_FRAMES)
        seam.append(cv2.addWeighted(tail_frame, 1.0 - amount, head_frame, amount, 0.0))

    loop = middle + seam
    if not loop:
        raise RuntimeError("O loop resultou vazio")

    boundary_error = float(np.mean(cv2.absdiff(loop[-1], loop[0])))
    report = {
        "source_frames": [start, end - 1],
        "reference_frame": start + reference_index,
        "output_frames": len(loop),
        "duration_seconds": len(loop) / TARGET_FPS,
        "ecc_min": min(correlations),
        "ecc_mean": float(np.mean(correlations)),
        "boundary_mean_absolute_error": boundary_error,
    }
    return loop, report


def encode_frames(frames: list[np.ndarray], ffmpeg: Path, temporary: Path) -> None:
    playback_frames = frames * PLAYBACK_REPETITIONS
    for index, frame in enumerate(playback_frames):
        destination = temporary / f"frame_{index:04d}.png"
        if not cv2.imwrite(str(destination), frame, (cv2.IMWRITE_PNG_COMPRESSION, 3)):
            raise RuntimeError(f"Falha ao gravar {destination}")

    pattern = str(temporary / "frame_%04d.png")
    common = [
        "-framerate", str(TARGET_FPS), "-i", pattern,
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "19",
        "-maxrate", "8M", "-bufsize", "16M", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-y",
    ]
    run([str(ffmpeg), "-hide_banner", "-loglevel", "error", *common, str(PUBLIC_VIDEOS / "centrifuge-spin-loop.mp4")])
    run([
        str(ffmpeg), "-hide_banner", "-loglevel", "error",
        "-framerate", str(TARGET_FPS), "-i", pattern,
        "-an", "-c:v", "libvpx-vp9", "-crf", "29", "-b:v", "0", "-row-mt", "1",
        "-pix_fmt", "yuv420p", "-y", str(PUBLIC_VIDEOS / "centrifuge-spin-loop.webm"),
    ])


def main() -> None:
    args = parse_args()
    source = args.input.resolve()
    ffmpeg = args.ffmpeg.resolve()
    if not source.is_file():
        raise FileNotFoundError(source)
    if not ffmpeg.is_file():
        raise FileNotFoundError(ffmpeg)

    PUBLIC_VIDEOS.mkdir(parents=True, exist_ok=True)
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    frames, fps = load_video(source)
    loop, report = build_loop(frames, fps)

    intro_end = report["reference_frame"] / fps
    run([
        str(ffmpeg), "-hide_banner", "-loglevel", "error", "-i", str(source),
        "-t", f"{intro_end:.6f}", "-map", "0:v:0", "-an", "-vf", f"fps={TARGET_FPS}",
        "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "8M",
        "-bufsize", "16M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-y",
        str(PUBLIC_VIDEOS / "centrifuge-film-intro.mp4"),
    ])
    run([
        str(ffmpeg), "-hide_banner", "-loglevel", "error", "-i", str(source),
        "-t", f"{intro_end:.6f}", "-map", "0:v:0", "-an", "-vf", f"fps={TARGET_FPS}",
        "-c:v", "libvpx-vp9", "-crf", "31", "-b:v", "0", "-row-mt", "1",
        "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p", "-y",
        str(PUBLIC_VIDEOS / "centrifuge-film-intro.webm"),
    ])

    temporary = Path(tempfile.mkdtemp(prefix="labtech-centrifuge-loop-"))
    try:
        encode_frames(loop, ffmpeg, temporary)
    finally:
        shutil.rmtree(temporary, ignore_errors=True)

    if not cv2.imwrite(
        str(PUBLIC_IMAGES / "centrifuge-film-poster.webp"),
        loop[0],
        (cv2.IMWRITE_WEBP_QUALITY, 88),
    ):
        raise RuntimeError("Falha ao gravar o poster WebP")

    report.update({
        "input": str(source),
        "input_fps": fps,
        "input_frames": len(frames),
        "intro_duration_seconds": intro_end,
        "playback_duration_seconds": len(loop) * PLAYBACK_REPETITIONS / TARGET_FPS,
        "passed": report["ecc_mean"] > 0.82 and report["boundary_mean_absolute_error"] < 8.0,
    })
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if not report["passed"]:
        raise RuntimeError("O loop não atingiu os limites visuais de validação")


if __name__ == "__main__":
    cv2.setNumThreads(max(1, min(8, cv2.getNumberOfCPUs())))
    main()
