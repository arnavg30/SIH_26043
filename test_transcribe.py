import whisper
import warnings
warnings.filterwarnings("ignore")

file_path = r"C:\Users\Arnav\Downloads\9e7a368b-b4e4-4aba-971f-fd5720daef33.wav"

try:
    print("Testing SMALL model...")
    model = whisper.load_model("small")
    res = model.transcribe(file_path, language="hi", fp16=False)
    print("SMALL output:", res["text"])
except Exception as e:
    print("SMALL error:", e)

try:
    print("Testing BASE model...")
    model2 = whisper.load_model("base")
    res2 = model2.transcribe(file_path, language="hi", fp16=False)
    print("BASE output:", res2["text"])
except Exception as e:
    print("BASE error:", e)
