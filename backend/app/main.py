from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="FazerCases API")

# Путь к собранному фронтенду (папка build)
frontend_build = Path(__file__).parent.parent.parent / "frontend" / "build"

if frontend_build.exists():
    app.mount("/", StaticFiles(directory=str(frontend_build), html=True), name="frontend")
    print(f"✅ Статика загружена из {frontend_build}")
else:
    print(f"❌ Папка со статикой не найдена: {frontend_build}")

# API эндпоинты выносим на /api, чтобы не мешать фронтенду
@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "FazerCases API is running"}