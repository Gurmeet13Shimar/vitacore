import joblib
try:
    data = joblib.load("vitacore_model.pkl")
    print("Type of loaded object:", type(data))
    if isinstance(data, dict):
        print("Keys:", data.keys())
        for k, v in data.items():
            print(f"Key {k}:", type(v))
    else:
        print("Model type:", type(data))
except Exception as e:
    print("Error:", e)
