
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

      try {
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

        if (error) throw error;

        if (data.session) {
          await saveProfile(data.user, name);
          message("Account created successfully!");
          showUser(data.user);
        } else {
          message("Registration successful. Check your email to confirm your account.");
        }

        signupForm.reset();
      } catch (error) {
        message(error.message);
      }
    });
  }

  // STUDENT LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      message("Logging in...");

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        await saveProfile(
          data.user,
          data.user.user_metadata?.full_name || ""
        );

        message("Welcome back to SomaHub!");
        showUser(data.user);
      } catch (error) {
        message(error.message);
      }
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
      userDisplay.textContent = "Logged in: " + user.email;
    }
  }

  // LOGOUT
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) throw error;

        message("You have logged out.");
        if (userDisplay) userDisplay.textContent = "";
      } catch (error) {
        message(error.message);
      }
    });
  }

  // RESTORE LOGIN SESSION
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      message(error.message);
      return;
    }

    if (data.session) {
      showUser(data.session.user);
    }
  });
});
