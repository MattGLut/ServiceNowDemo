import json
from pathlib import Path

SRC = Path(
    r"C:/Users/I6728/.cursor/projects/c-Users-I6728-Workspace-ServiceNowPlayground-ServiceNowDemo/uploads/Untitled-5-L1-L4-0.txt"
)
OUT = Path(__file__).resolve().parent.parent / "docs" / "doc-intel-documents-sample.json"

FIELD_KEYS = (
    "FieldType",
    "ValueString",
    "ValueNumber",
    "ValueDouble",
    "ValueInt64",
    "ValueDate",
    "ValueTime",
    "ValueCurrency",
    "ValueAddress",
    "ValueList",
    "ValueDictionary",
    "ValueObject",
    "Content",
    "Confidence",
)


def parse_top_level_json(raw: str) -> dict:
    start = raw.find("{")
    depth = 0
    end = None
    for idx, ch in enumerate(raw[start:], start=start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = idx + 1
                break
    if end is None:
        raise ValueError("Could not find complete JSON object in source file")
    return json.loads(raw[start:end])


def slim_documents(documents: list) -> list:
    slim_docs = []
    for doc in documents:
        slim = {
            "DocumentType": doc.get("DocumentType"),
            "Confidence": doc.get("Confidence"),
            "Fields": {},
        }
        fields = doc.get("Fields") or {}
        for name, field in fields.items():
            if not isinstance(field, dict):
                slim["Fields"][name] = field
                continue
            slim_field = {}
            for key in FIELD_KEYS:
                if key not in field:
                    continue
                value = field[key]
                if value is None:
                    continue
                if isinstance(value, (list, dict)) and len(value) == 0:
                    continue
                slim_field[key] = value
            slim["Fields"][name] = slim_field
        slim_docs.append(slim)
    return slim_docs


def main() -> None:
    raw = SRC.read_text(encoding="utf-8")
    payload = parse_top_level_json(raw)
    documents = payload.get("Documents", [])
    slim_docs = slim_documents(documents)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(slim_docs, indent=2, ensure_ascii=False), encoding="utf-8")

    field_count = len(slim_docs[0]["Fields"]) if slim_docs else 0
    print(f"Wrote {len(slim_docs)} document(s) to {OUT}")
    print(f"Field count: {field_count}")


if __name__ == "__main__":
    main()
