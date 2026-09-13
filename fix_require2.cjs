const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// In ProfileScreen
code = code.replace(
  "const api = await import('./api'); const { getProfileMe } = api;\n    getProfileMe().then((res: any) => {",
  "import('./api').then(({ getProfileMe }) => {\n      getProfileMe().then((res: any) => {"
);
// Make sure to close the block correctly for ProfileScreen
code = code.replace(
  "setLoading(false);\n    }).catch((err: any) => {",
  "setLoading(false);\n      }).catch((err: any) => {\n        console.error(err);\n        setLoading(false);\n      });\n    });"
);

// In IndustryDashboardScreen
code = code.replace(
  "const api = await import('./api'); const { getRecommendedProblems } = api;\n    getRecommendedProblems().then((data: any) => {",
  "import('./api').then(({ getRecommendedProblems }) => {\n      getRecommendedProblems().then((data: any) => {"
);
// Close it
code = code.replace(
  "setLoading(false);\n    }).catch((err: any) => {\n      console.error(err);\n      setLoading(false);\n    });\n  }, []);",
  "setLoading(false);\n      }).catch((err: any) => {\n        console.error(err);\n        setLoading(false);\n      });\n    });\n  }, []);"
);

// In IndustryProjectDetailScreen
code = code.replace(
  "const api = await import('./api'); const { getProblemByCode } = api;\n      getProblemByCode(selectedTrackingId).then((data: any) => setProblem(data.problem)).catch(console.error);",
  "import('./api').then(({ getProblemByCode }) => {\n        getProblemByCode(selectedTrackingId).then((data: any) => setProblem(data.problem)).catch(console.error);\n      });"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed require with properly chained Promises");
