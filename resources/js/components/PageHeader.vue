<template>
    <div class="">
        <h4 class="page-title pt-3 pr-2 pl-3 pb-0 text-white text-center">{{ pageheaderdata.dashboardName }}</h4>
    </div>
</template>

<script>
export default {
    name : 'PageHeader',

    props:{
        pageheaderdata:{
            type: Object,
        } 
    }
}
</script>