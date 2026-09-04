import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

old_cta = '''        {/* Primary CTA */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("cit.report")}</div>
            <div className="font-medium text-sm opacity-75">?????? ??????? ????</div>
          </div>
          <FileText size={36} />
        </button>'''

new_cta = '''        {/* Primary CTA */}
        <div className="flex flex-col gap-3">
          <button onClick={() => onNav("report-step1")}
            className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all"
            style={{ background: "var(--amber)", color: "var(--navy)" }}>
            <div>
              <div className="font-black text-lg leading-tight">{t("cit.report")}</div>
              <div className="font-medium text-sm opacity-75">\u0938\u092e\u0938\u094d\u092f\u093e \u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0915\u0930\u0947\u0902</div>
            </div>
            <FileText size={36} />
          </button>
          <button onClick={() => alert("Voice input coming soon!")}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all font-bold text-sm"
            style={{ background: "var(--success-bg)", color: "var(--green)", border: "2px solid var(--green)" }}>
            <Mic size={20} /> Voice Report (बोल कर बताएं)
          </button>
        </div>'''

app_code = app_code.replace(old_cta, new_cta)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
