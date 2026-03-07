#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import time
import signal
import subprocess
import threading
import re
from pathlib import Path

# ================== НАСТРОЙКИ ==================
BACKEND_PORT = 8000
BACKEND_DIR = Path(__file__).parent / "backend"
FRONTEND_DIR = Path(__file__).parent / "frontend"
BACKEND_ENV = BACKEND_DIR / ".env"
FRONTEND_ENV = FRONTEND_DIR / ".env"
# ===============================================

processes = []

def update_env_file(env_path: Path, key: str, value: str):
    """Обновить или добавить переменную в .env файл"""
    if not env_path.exists():
        env_path.write_text(f"{key}={value}\n", encoding='utf-8')
        print(f"✅ Создан {env_path.name} с {key}={value}")
        return

    lines = env_path.read_text(encoding='utf-8').splitlines()
    found = False
    new_lines = []
    for line in lines:
        if line.startswith(f"{key}="):
            new_lines.append(f"{key}={value}")
            found = True
        else:
            new_lines.append(line)
    if not found:
        new_lines.append(f"{key}={value}")
    env_path.write_text("\n".join(new_lines) + "\n", encoding='utf-8')
    print(f"✅ Обновлён {env_path.name}: {key}={value}")

def start_backend():
    """Запустить backend с поддержкой UTF-8 в консоли Windows"""
    print("🚀 Запуск backend...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    if sys.platform == "win32":
        cmd = f"venv\\Scripts\\activate.bat && python run.py"
        proc = subprocess.Popen(
            cmd,
            cwd=str(BACKEND_DIR),
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1,
            env=env
        )
    else:
        proc = subprocess.Popen(
            ["bash", "-c", f"source venv/bin/activate && python run.py"],
            cwd=str(BACKEND_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1,
            env=env
        )
    processes.append(proc)

    def log_output():
        for line in proc.stdout:
            print(f"\033[94m[BACKEND]\033[0m {line}", end='')
    threading.Thread(target=log_output, daemon=True).start()
    return proc

def start_frontend():
    """Запустить frontend"""
    print("🚀 Запуск frontend...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    proc = subprocess.Popen(
        [npm_cmd, "start"],
        cwd=str(FRONTEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    processes.append(proc)

    def log_output():
        for line in proc.stdout:
            print(f"\033[92m[FRONTEND]\033[0m {line}", end='')
    threading.Thread(target=log_output, daemon=True).start()
    return proc

def start_tunnel():
    """
    Запустить SSH-туннель через serveo.net.
    Возвращает публичный HTTPS-URL.
    """
    print("🚇 Запуск туннеля serveo.net...")
    ssh_cmd = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "UserKnownHostsFile=/dev/null",
        "-R", f"80:localhost:{BACKEND_PORT}",
        "serveo.net"
    ]

    proc = subprocess.Popen(
        ssh_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    processes.append(proc)

    url = None
    # Читаем вывод построчно
    while True:
        line = proc.stdout.readline()
        if not line:
            break
        print(f"\033[93m[TUNNEL]\033[0m {line}", end='')
        # Ищем URL вида https://что-то.serveo.net
        match = re.search(r"(https://([a-zA-Z0-9-]+)\.serveo\.net)", line)
        if match:
            url = match.group(1)
            break
        if proc.poll() is not None:
            break

    if not url:
        print("❌ Не удалось получить URL от туннеля.")
        cleanup()
        sys.exit(1)

    print(f"\n✅ Туннель запущен, URL: {url}\n")
    return proc, url

def cleanup(signum=None, frame=None):
    """Завершить все дочерние процессы"""
    print("\n\n⏳ Завершение работы...")
    for proc in processes:
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                proc.kill()
    print("👋 Все процессы остановлены.")
    sys.exit(0)

def main():
    print("╔══════════════════════════════════════╗")
    print("║   FazerCases – автоматический запуск ║")
    print("╚══════════════════════════════════════╝")

    # Проверка SSH (для Windows)
    if sys.platform == "win32":
        try:
            subprocess.run(["ssh", "-V"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ SSH не найден. Установите OpenSSH Client:\n"
                  "   Настройки → Приложения → Дополнительные компоненты → Добавить компонент → OpenSSH Client")
            sys.exit(1)

    # Запуск туннеля и получение URL
    tunnel_proc, public_url = start_tunnel()

    # Обновление .env файлов
    print("\n📝 Обновление .env файлов...")
    update_env_file(BACKEND_ENV, "API_URL", public_url)
    update_env_file(FRONTEND_ENV, "REACT_APP_API_URL", public_url)

    # Запуск backend (он прочитает обновлённый .env)
    backend_proc = start_backend()
    time.sleep(3)  # Даём бэкенду время на инициализацию

    # Запуск frontend
    frontend_proc = start_frontend()

    # Обработчики сигналов
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print(f"\n✨ Все компоненты запущены. Ваш WebApp URL: {public_url}")
    print("   Вставьте его в BotFather как URL для кнопки.\n")
    print("Нажмите Ctrl+C для остановки.\n")

    # Ожидание завершения процессов
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("\n❌ Backend неожиданно завершился.")
                break
            if frontend_proc.poll() is not None:
                print("\n❌ Frontend неожиданно завершился.")
                break
            if tunnel_proc.poll() is not None:
                print("\n❌ Туннель неожиданно завершился.")
                break
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()