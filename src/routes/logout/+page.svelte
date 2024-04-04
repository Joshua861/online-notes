<script>
	import { goto } from '$app/navigation';
	import { initializeApp } from 'firebase/app';
	import { getAuth, signOut } from 'firebase/auth';

	const firebaseConfig = {
		apiKey: 'AIzaSyAS0OpX3__te9ONUbJH1hy5ovMIYeF84xo',
		authDomain: 'online-notes-1c459.firebaseapp.com',
		projectId: 'online-notes-1c459',
		storageBucket: 'online-notes-1c459.appspot.com',
		messagingSenderId: '261226857736',
		appId: '1:261226857736:web:a4fb8bc8fd249cf95098bd'
	};

	let app = initializeApp(firebaseConfig);
	let auth = getAuth(app);

	let error = '';

	signOut(auth)
		.then(() => {
			goto('/');
		})
		.catch((err) => {
			err = error;
		});
</script>

{error}
