import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

def patch_dashboard(screen_name, code):
    # Find the state declarations
    state_pattern = r'const \[problems, setProblems\] = useState<any\[\]>\(\[\]\);'
    
    # We want to replace it with two states
    new_states = 'const [problems, setProblems] = useState<any[]>([]);\n  const [myProjects, setMyProjects] = useState<any[]>([]);'
    
    # Find the block for the screen
    start_idx = code.find(f'function {screen_name}')
    if start_idx == -1: return code
    end_idx = code.find('function ', start_idx + 10)
    if end_idx == -1: end_idx = len(code)
    
    screen_code = code[start_idx:end_idx]
    
    # Replace state
    screen_code = screen_code.replace(state_pattern, new_states, 1)
    
    # Replace fetch
    fetch_old = 'getRecommendedProblems().then(data => {\n              setProblems(data.problems || []);\n            }).catch(console.error);'
    fetch_new = 'getRecommendedProblems().then(data => {\n              setProblems(data.problems || []);\n            }).catch(console.error);\n            getMyProblems().then(data => {\n              setMyProjects(data.problems || []);\n            }).catch(console.error);'
    screen_code = screen_code.replace(fetch_old, fetch_new, 1)
    
    # Replace KPI cards
    kpi_old = 'value: "0"'
    
    # We need to compute stats before KPI cards
    stats_logic = '''
  const accepted = myProjects.filter(p => p.initiative_status === 'ACCEPTED' || p.status === 'ASSIGNED').length;
  const active = myProjects.filter(p => p.initiative_status === 'IN_PROGRESS' || p.status === 'IN_PROGRESS').length;
  const completed = myProjects.filter(p => p.initiative_status === 'COMPLETED' || p.status === 'SOLVED').length;
  
  return (
'''
    screen_code = screen_code.replace('return (\n', stats_logic, 1)
    
    # Now replace the values in the map
    screen_code = screen_code.replace('{ icon: <CheckCircle size={18} />, label: "Accepted", value: "0"', '{ icon: <CheckCircle size={18} />, label: "Accepted", value: accepted.toString()')
    screen_code = screen_code.replace('{ icon: <Activity size={18} />, label: "Active Projects", value: "0"', '{ icon: <Activity size={18} />, label: "Active Projects", value: active.toString()')
    screen_code = screen_code.replace('{ icon: <ThumbsUp size={18} />, label: "Completed", value: "0"', '{ icon: <ThumbsUp size={18} />, label: "Completed", value: completed.toString()')
    
    # Render Active Projects below new challenges
    render_active_projects = '''
          <h2 className="font-bold text-sm mb-3 mt-6" style={{ color: "var(--text)" }}>My Active Projects</h2>
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
        </div>
'''
    # Find the end of the new challenges grid block
    # We look for:
    #             ))}
    #           </div>
    #         )}
    #       </div>
    #       <MobileNav onNav={onNav} />
    # But wait, let's just insert it before MobileNav
    parts = screen_code.split('<MobileNav')
    if len(parts) == 2:
        screen_code = parts[0] + render_active_projects + '<MobileNav' + parts[1]
        
    return code[:start_idx] + screen_code + code[end_idx:]

code = patch_dashboard('UniDashboardScreen', code)
code = patch_dashboard('IndustryDashboardScreen', code)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched UI successfully!")
