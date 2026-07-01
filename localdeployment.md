Backend
```
Set-Location "D:\Work\Personal Project\Butterfly\Butterfly"
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend
```
Set-Location "D:\Work\Personal Project\Butterfly\Butterfly\frontend"
npm run dev
```