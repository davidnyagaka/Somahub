// SOMAHUB AUTHENTICATION SYSTEM

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");
  const authMessage = document.getElementById("authMessage");
  const userDisplay = document.getElementById("userDisplay");

  function message(text) {
    if (authMessage) authMessage.textContent = text;
  }

  // STUDENT REGISTRATION
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      message("Creating your account...");

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "student"
          }
        }
      });

      if (error) {
        message(error.message);
        return;
      }

      if (data.session) {
        await saveProfile(data.user, name);
        message("Account created successfully! Welcome to SomaHub.");
      } else {
        message("Registration successful. Check your email to confirm your account, then log in.");
      }

      signupForm.reset();
    });
  }

  // STUDENT LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      message("Logging in...");

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        message(error.message);
        return;
      }

      await saveProfile(
        data.user,
        data.user.user_metadata?.full_name || ""
      );

      message("Welcome back to SomaHub!");
      showUser(data.user);
    });
  }

  // SAVE PROFILE
  async function saveProfile(user, name) {
    if (!user) return;

    const { error } = await supabaseClient
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: name || user.user_metadata?.full_name || "",
        role: "student"
      });

    if (error) {
      console.error("Profile save error:", error.message);
    }
  }

  // DISPLAY LOGGED-IN USER
  function showUser(user) {
    if (userDisplay) {
      userDisplay.textContent =
        "Logged in: " + user.email;
    }
  }

  // LOGOUT
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        message(error.message);
        return;
      }

      message("You have logged out.");
      if (userDisplay) userDisplay.textContent = "";
    });
  }

  // RESTORE LOGIN SESSION
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) {
      showUser(data.session.user);
    }
  });
});

