const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const old_state = \  const [screen, setScreen] = useState<Screen>(() => (localStorage.getItem(\ctive_screen\) as Screen) || \landing\);\n  const [role, setRole] = useState(\citizen\);\;
const new_state = \  const [screen, setScreen] = useState<Screen>(\landing\);\n  const [role, setRole] = useState(\citizen\);\n  const [authChecked, setAuthChecked] = useState(false);\;
code = code.replace(old_state, new_state);

const old_effect = \  useEffect(() => {\n    const timer = setTimeout(() => setInitialLoading(false), 500);\n      let unsubscribe = () => {};\n      import(\./firebase/config\).then(({ auth }) => {\n        unsubscribe = auth.onAuthStateChanged(user => {\n          if (!user) {\n            setScreen(\landing\);\n            localStorage.removeItem(\ctive_screen\);\n          }\n        });\n      });\n      return () => { clearTimeout(timer); unsubscribe(); };\n  }, []);\;
const new_effect = \  useEffect(() => {\n    const timer = setTimeout(() => setInitialLoading(false), 500);\n    let unsubscribe = () => {};\n    import(\./firebase/config\).then(({ auth }) => {\n      unsubscribe = auth.onAuthStateChanged(user => {\n        if (!user) {\n          setRole(\citizen\);\n          setScreen(\landing\);\n          sessionStorage.removeItem(\ctive_screen\);\n          sessionStorage.removeItem(\ctive_role\);\n          localStorage.removeItem(\ctive_screen\); // Clear legacy\n          setAuthChecked(true);\n        } else {\n          import(\./api\).then(({ getProfileMe }) => {\n            getProfileMe().then(data => {\n              const st = data?.user?.sub_type;\n              let r = \citizen\;\n              if (st === \PANCHAYAT\) r = \panchayat\;\n              else if (st === \LOCAL_ORG\) r = \localorg\;\n              else if (st === \ORGANIZATION\) r = \org-solver\;\n              else if (st === \INDUSTRY\) r = \industry\;\n              else if (st === \UNIVERSITY\) r = \university\;\n              \n              setRole(r);\n              sessionStorage.setItem(\ctive_role\, r);\n              \n              const sessionScreen = sessionStorage.getItem(\ctive_screen\) as Screen;\n              if (sessionScreen && sessionScreen !== \landing\) {\n                setScreen(sessionScreen);\n              } else {\n                const home = getHomeDashboard(r);\n                setScreen(home);\n                sessionStorage.setItem(\ctive_screen\, home);\n              }\n              setAuthChecked(true);\n            }).catch(err => {\n              console.error(err);\n              const sr = sessionStorage.getItem(\ctive_role\) || \citizen\;\n              setRole(sr);\n              const ss = sessionStorage.getItem(\ctive_screen\) as Screen;\n              if (ss && ss !== \landing\) {\n                setScreen(ss);\n              } else {\n                setScreen(getHomeDashboard(sr));\n              }\n              setAuthChecked(true);\n            });\n          });\n        }\n      });\n    });\n    return () => { clearTimeout(timer); unsubscribe(); };\n  }, []);\;
code = code.replace(old_effect, new_effect);

const old_nav = \    if (roleMap[s]) setRole(roleMap[s]!);\n    setTimeout(() => {\n      setScreen(s);\n        localStorage.setItem(\ctive_screen\, s);\n        window.scrollTo(0, 0);\n      setLoading(false);\n    }, 450);\;
const new_nav = \    if (roleMap[s]) {\n      setRole(roleMap[s]!);\n      sessionStorage.setItem(\ctive_role\, roleMap[s]!);\n    }\n    setTimeout(() => {\n      setScreen(s);\n      sessionStorage.setItem(\ctive_screen\, s);\n      localStorage.removeItem(\ctive_screen\);\n      window.scrollTo(0, 0);\n      setLoading(false);\n    }, 450);\;
code = code.replace(old_nav, new_nav);

code = code.replace(\<NavJharLoadingOverlay show={loading || initialLoading} />\, \<NavJharLoadingOverlay show={loading || initialLoading || !authChecked} />\);

const old_render = \        {/* Language modal — blocks entry on first visit */}\n        {showLangModal && (\n          <LanguageModal onDone={(l) => {\n            setLangAndSave(l);\n            setShowLangModal(false);\n            setShowMitraWelcome(true);\n          }} />\n        )}\;
const new_render = \        {authChecked && (\n          <>\n        {/* Language modal — blocks entry on first visit */}\n        {showLangModal && (\n          <LanguageModal onDone={(l) => {\n            setLangAndSave(l);\n            setShowLangModal(false);\n            setShowMitraWelcome(true);\n          }} />\n        )}\;
code = code.replace(old_render, new_render);

const old_end = \        {screen === \i-result\ && <AIResultScreen {...props} />}\n      </div>\n    </Ctx.Provider>\;
const new_end = \        {screen === \i-result\ && <AIResultScreen {...props} />}\n          </>\n        )}\n      </div>\n    </Ctx.Provider>\;
code = code.replace(old_end, new_end);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched');

