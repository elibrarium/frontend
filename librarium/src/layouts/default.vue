<template>
  <div class="main-layout">
    <navbar/>
    <child/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  name: 'MainLayout',
  components: {
    Navbar,
  },
};
</script>
