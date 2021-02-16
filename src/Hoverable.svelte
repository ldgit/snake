<script type="text/typescript">
let hovering;
const enter = () => {
  hovering = true;
};
const leave = () => {
  hovering = false;
};
</script>

<div on:mouseenter={enter} on:mouseleave={leave} {...$$restProps}>
  <slot {hovering} />
</div>
