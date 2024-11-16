<script>
  import { pb } from '$lib/pocketbase'; 
  import { goto } from '$app/navigation'; 

  let email = '';
  let password = '';
  let message = '';

  async function handleLogin() {
    try {
        const userAuthData = await pb.collection('users').authWithPassword(email, password);
        if (userAuthData.record.isAdmin) {
            console.log("Admin logged in:", userAuthData);
            await pb.authStore.save;
            goto('/dashboard');
        } else {
            message = "You do not have admin privileges!";
        }
    } catch (error) {
        message = "Incorrect email or password!";
        console.error("Error logging in:", error);
    }
}
</script>

<style>
   :global(body) {
        background-color: #CCFFDD; 
        margin: 0;
        padding: 0;
        height: 100vh; 
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: flex-start; 
        overflow-x: hidden;
    }

    * {
    box-sizing: border-box;
  }

  .login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

  .container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #AD9651;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    height: auto; 
  }

  h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 35px;
    text-align: center;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #00703C;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Bebas Neue', sans-serif;
  }

  button:hover {
    background-color: #005a2c;
  }

  .message {
    text-align: center;
    margin-top: 5px;
    color: red;
  }
</style>
<div class="login-wrapper">
  <div class="container">
    <h1>Niner Security Administration</h1>
    <form on:submit|preventDefault={handleLogin}>
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} placeholder="Enter your email" required />

      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} placeholder="Enter your password" required />

      <button type="submit">Login</button>
    </form>

    {#if message}
      <div class="message">{message}</div>
    {/if}
  </div>
</div>