import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

def patch_bottom(screen_name, code):
    start_idx = code.find(f'function {screen_name}')
    if start_idx == -1: return code
    end_idx = code.find('function ', start_idx + 10)
    if end_idx == -1: end_idx = len(code)
    
    screen_code = code[start_idx:end_idx]
    
    # We want to insert the Active Projects section right before the closing div of max-w-7xl
    # Let's find:
    #             ))}
    #           </div>
    #         )}
    #       </div>
    #     </div>
    #   );
    
    idx = screen_code.rfind('</div>\n    </div>\n  );')
    if idx != -1:
        render_active = '''
          <h2 className="font-bold text-sm mb-3 mt-8" style={{ color: "var(--text)" }}>My Active Projects</h2>
          {myProjects.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No active projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((c, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.description || c.title}</h3>
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <MapPin size={11} /> {c.district || "Location"}
                      </p>
                    </div>
                    <StatusBadge status={c.initiative_status || c.status} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Btn variant="primary" className="text-xs flex-1" onClick={() => {
                        setReport(curr => ({ ...curr, problemCode: c.problem_code, description: c.description }));
                        onNav("solver-dashboard");
                    }}>View Details</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}
'''
        screen_code = screen_code[:idx] + render_active + screen_code[idx:]
        
    return code[:start_idx] + screen_code + code[end_idx:]

code = patch_bottom('UniDashboardScreen', code)
code = patch_bottom('IndustryDashboardScreen', code)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched bottom UI successfully!")
