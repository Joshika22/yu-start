<script lang="ts">
	import type { ChatMessage } from '$lib/stores/chat_store';

	export let props: ChatMessage;
</script>


<div
	class="flex flex-col space-y-2 rounded-xl  {props.name === 'Yu-Bot'
		? 'bg-transparent'
		: 'bg-muted border'} p-2"
>
	<div class="font-bold text-primary">{props.name}</div>
	<div>
		{props.message}
	</div>
</div>
