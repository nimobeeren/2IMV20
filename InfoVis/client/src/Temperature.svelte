<script>
  import { numToMonth } from './consts'

  export let startYear;
  export let endYear;
  export let month;
</script>

<div>
  Temperature from {startYear} to {endYear} during {numToMonth(month)}.
</div>
