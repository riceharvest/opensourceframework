"""
Qwen3.6-35B-A3B-FP8 on Modal with vLLM
Single A100-80GB, scale-to-zero
"""

import modal

app = modal.App("qwen36-vllm-fp8")

hf_cache = modal.Volume.from_name("hf-cache", create_if_missing=True)

# Official vLLM image with CUDA + vLLM pre-installed
vllm_image = (
    modal.Image.from_registry("nvidia/cuda:12.4.0-devel-ubuntu22.04", add_python="3.12")
    .pip_install("vllm>=0.6.0", "transformers")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)


@app.function(
    image=vllm_image,
    gpu="A100-80GB",
    scaledown_window=60,
    timeout=3600,
    max_containers=1,
    single_use_containers=False,
    volumes={"/root/.cache/huggingface": hf_cache},
)
@modal.web_server(port=8000, startup_timeout=600)
def serve():
    import subprocess
    import os

    env = os.environ.copy()
    env["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

    cmd = [
        "python", "-m", "vllm.entrypoints.openai.api_server",
        "--model", "Qwen/Qwen3.6-35B-A3B-FP8",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--gpu-memory-utilization", "0.88",
        "--kv-cache-dtype", "fp8",
        "--max-model-len", "262144",
        "--tensor-parallel-size", "1",
        "--enforce-eager",
    ]

    subprocess.Popen(cmd, env=env)
