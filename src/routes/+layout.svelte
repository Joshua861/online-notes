<script>
	import '../app.pcss';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster />
<slot />
<div class="fixed left-0 top-0 z-[-1000] flex h-screen w-screen">
	<p class="mt-auto px-3 font-mono text-slate-500">v0.2.4b</p>
</div>
