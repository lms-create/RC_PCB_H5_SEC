<template>
  <div>
    <p>
      {{ route_id }}
    </p>
  </div>
</template>

<script>
export default {
  name: "FindDetail",
  created() {
    this.getRouteId();
  },
  data() {
    return {
      route_id: "3",
    };
  },
  methods: {
    getRouteId() {
      console.log(this.$route.query.id);
      this.route_id = this.$route.query.id;
    },
  },
};
</script>

<style>
</style>