<script lang="ts">
	import { authStore, dbStore } from '$lib/stores';
	import { doc, getDoc } from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { userStore } from 'sveltefire';
	import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
	import { toast } from 'svelte-sonner';

	let user: any,
		username: string,
		password: string = '',
		email: string = '';

	userStore(get(authStore)).subscribe(async (userVal) => {
		user = userVal;

		if (user != null) {
			username = (await getDoc(doc(get(dbStore), 'users', user.uid))).data()!.username;
		}
	});

	// function changePassword() {
	// 	updatePassword(user, password)
	// 		.then(() => {
	// 			toast.success('Password changed!');
	// 		})
	// 		.catch((error) => {
	// 			toast.error('There was an error changing your password.', {
	// 				description: error
	// 			});
	// 		});
	// }

	// function changeEmail() {
	// 	try {
	// 		if (!user) {
	// 			toast.error('No user.');
	// 		}

	// 		updateEmail(get(authStore).currentUser!, email)
	// 			.then(() => {
	// 				toast.success('Your email has been updated.');
	// 			})
	// 			.catch((error) => {
	// 				toast.error('There was an error changing your email.', {
	// 					description: error
	// 				});
	// 			});
	// 	} catch (err: any) {
	// 		toast.error('Error', {
	// 			description: err
	// 		});
	// 	}
	// }

	// function verifyEmail() {
	// 	sendEmailVerification(user).then(() => {
	// 		toast.success('Sent!');
	// 	});
	// }
</script>

<h1>Account Settings</h1>
<hr />
<br />

{#if user != null}
	<details>
		<summary><strong>User info JSON</strong></summary>
		<pre class="my-10">
      {JSON.stringify(user, null, 4)}
  </pre>
	</details>

	Username:<code>{username}</code>
	<br />
	Email adress: <code>{user.email}</code>

	<br /><br />
	<hr />
	<br />

	<!-- {#if user.emailVerified}
		<label>
			New password
			<input type="password" bind:value={password} />
		</label>
		<button on:click={changePassword}>Change password</button>
	{:else}
		<button class="w-full" on:click={verifyEmail}>Verify email</button>
		<small class="text-slate-600 dark:text-slate-400"
			>You can only change your password if your email has been verified.</small
		>
	{/if}

	<br /><br />
	<hr />
	<br />

	<label>
		New email
		<input type="email" bind:value={email} />
	</label>
	<button class="w-full" on:click={changeEmail}>Change email</button>

	<br /><br />
	<hr />
	<br /> -->

	<a href="/logout" role="button" class="w-full">Logout</a>
{:else}
	<p>loading...</p>
{/if}
