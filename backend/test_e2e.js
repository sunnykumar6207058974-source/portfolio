const API_BASE = "http://localhost:5001/api";

const runE2ETests = async () => {
  console.log("=================================================");
  console.log("🚀 STARTING PIXELFORGE FULL E2E TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = "") => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // TEST 1: Health Check API
    console.log("--- 1. TESTING API HEALTH & SYSTEM STATUS ---");
    const resHealth = await fetch(`${API_BASE}/health`);
    const healthJson = await resHealth.json();
    assert(resHealth.status === 200 && healthJson.status === "online", "GET /api/health", `Got status ${resHealth.status}`);

    // TEST 2: GET Projects API
    console.log("\n--- 2. TESTING PUBLIC READ APIS (GET) ---");
    const resProjects = await fetch(`${API_BASE}/projects`);
    const projectsJson = await resProjects.json();
    assert(resProjects.status === 200 && projectsJson.success && Array.isArray(projectsJson.data), "GET /api/projects", `Count: ${projectsJson.count}`);

    // TEST 3: GET Services API
    const resServices = await fetch(`${API_BASE}/services`);
    const servicesJson = await resServices.json();
    assert(resServices.status === 200 && servicesJson.success && Array.isArray(servicesJson.data), "GET /api/services", `Count: ${servicesJson.count}`);

    // TEST 4: GET Skills API
    const resSkills = await fetch(`${API_BASE}/skills`);
    const skillsJson = await resSkills.json();
    assert(resSkills.status === 200 && skillsJson.success && Array.isArray(skillsJson.data), "GET /api/skills", `Count: ${skillsJson.count}`);

    // TEST 5: GET Site Config API
    const resConfig = await fetch(`${API_BASE}/config`);
    const configJson = await resConfig.json();
    assert(resConfig.status === 200 && configJson.success && configJson.data, "GET /api/config", "Site config loaded");

    // TEST 6: Invalid Inputs - Contact Form Validation
    console.log("\n--- 3. TESTING INVALID INPUTS & VALIDATION ERROR HANDLING ---");
    const resBadContact = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "not-an-email", subject: "", message: "hi" }),
    });
    const badContactJson = await resBadContact.json();
    assert(resBadContact.status === 400 && Array.isArray(badContactJson.errors), "POST /api/contact Invalid Input (400 Bad Request)", `Errors: ${badContactJson.errors?.length}`);

    // TEST 7: Valid Contact Form Submission (POST)
    console.log("\n--- 4. TESTING CONTACT FORM API (POST) ---");
    const resGoodContact = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Tester",
        email: "e2e_tester@example.com",
        subject: "E2E Test Subject",
        message: "Automated end-to-end integration test message.",
      }),
    });
    const goodContactJson = await resGoodContact.json();
    assert(resGoodContact.status === 201 && goodContactJson.success, "POST /api/contact Valid Submission (201 Created)", goodContactJson.message);

    // TEST 8: Auth - Invalid Login Credentials
    console.log("\n--- 5. TESTING AUTHENTICATION & LOGIN/LOGOUT ---");
    const resBadLogin = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "wrong@example.com", password: "wrongpassword" }),
    });
    assert(resBadLogin.status === 401, "POST /api/auth/login Invalid Credentials (401 Unauthorized)", `Status: ${resBadLogin.status}`);

    // TEST 9: Auth - Valid Admin Login
    const resLogin = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sunnykumar6207058974@gmail.com",
        password: "sunnypassword123",
      }),
    });
    const loginJson = await resLogin.json();
    const token = loginJson.data?.accessToken;
    assert(resLogin.status === 200 && token, "POST /api/auth/login Admin Success (200 OK)", `JWT Issued: ${!!token}`);

    // TEST 10: Auth - Signup New User (POST /api/auth/register)
    const newEmail = `e2e_user_${Date.now()}@example.com`;
    const resSignup = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Registered User",
        email: newEmail,
        password: "e2epassword123",
        role: "admin",
      }),
    });
    const signupJson = await resSignup.json();
    assert(resSignup.status === 201 && signupJson.success, "POST /api/auth/register Signup (201 Created)", signupJson.message);

    // TEST 11: Protected Route - Unauthenticated Access Rejection (401)
    console.log("\n--- 6. TESTING PROTECTED ROUTES & AUTHORIZATION SECURITY ---");
    const resUnauth = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauth Project", category: "Web Apps", description: "Test" }),
    });
    assert(resUnauth.status === 401, "POST /api/projects Unauthenticated Rejection (401 Unauthorized)", `Status: ${resUnauth.status}`);

    // TEST 12: DATABASE CRUD - Create Project (POST)
    console.log("\n--- 7. TESTING DATABASE MONGOOSE CRUD OPERATIONS ---");
    const resCreateProj = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "E2E Automated Test Project",
        category: "Web Apps",
        description: "Full end-to-end project database integration test.",
        tech: ["React", "Express", "MongoDB"],
        demoUrl: "https://example.com/demo",
        githubUrl: "https://github.com/example/repo",
      }),
    });
    const createProjJson = await resCreateProj.json();
    console.log("Create Project Response:", createProjJson);
    const createdId = createProjJson.data?._id || createProjJson.data?.id;
    assert(resCreateProj.status === 201 && createdId, "Database CRUD - CREATE Project (201 Created)", `ID: ${createdId}`);

    // TEST 13: DATABASE CRUD - Update Project (PUT)
    if (createdId) {
      const resUpdateProj = await fetch(`${API_BASE}/projects/${createdId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "E2E Automated Test Project - UPDATED" }),
      });
      const updateProjJson = await resUpdateProj.json();
      console.log("Update Project Response:", resUpdateProj.status, updateProjJson);
      assert(resUpdateProj.status === 200 && updateProjJson.success, "Database CRUD - UPDATE Project (200 OK)", updateProjJson.message || updateProjJson.error);

      // TEST 14: DATABASE CRUD - Delete Project (DELETE)
      const resDeleteProj = await fetch(`${API_BASE}/projects/${createdId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const deleteProjJson = await resDeleteProj.json();
      console.log("Delete Project Response:", resDeleteProj.status, deleteProjJson);
      assert(resDeleteProj.status === 200 && deleteProjJson.success, "Database CRUD - DELETE Project (200 OK)", deleteProjJson.message || deleteProjJson.error);
    }

    console.log("\n=================================================");
    console.log(`📊 E2E TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=================================================\n");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Fatal E2E Test Runner Error:", err);
    process.exit(1);
  }
};

runE2ETests();
