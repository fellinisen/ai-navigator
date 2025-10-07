<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">AI Navigator</router-link>
        <div class="nav-links">
          <router-link to="/admin" class="nav-link">Admin</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2024 AI Navigator. All rights reserved.</p>
      </div>
    </footer>
  </div>
  </template>

<script>
export default { name: 'App' }
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: white; color: #333; line-height: 1.6; }
#app { min-height: 100vh; display: flex; flex-direction: column; }
.navbar { background-color: #171C8F; padding: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.nav-logo { color: white; text-decoration: none; font-size: 1.5rem; font-weight: bold; }
.nav-logo:hover { color: #0072CE; }
.nav-links { float: right; }
.nav-link { color: #fff; text-decoration: none; margin-left: 1rem; }
.nav-link:hover { color: #cfe6ff; }
.main-content { flex: 1; padding: 2rem 0; }
.footer { background-color: #f8f9fa; padding: 1rem 0; border-top: 1px solid #e9ecef; }
.footer-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; text-align: center; color: #666; }
</style>