import {useRoute} from 'vue-router'

export default {
    isExpired: function(){
        return (slug, expireAfter) => {
            if(!expireAfter)
                expireAfter = this.store.prefs.expireAfter
            return !this.store.jobs.getLastUpdate(slug) || Date.now() - this.store.jobs.getLastUpdate(slug) > expireAfter
        }
    },
    path: function() { return useRoute().path },
    relayFromUrl() {
        const protocol = this.$route.params.protocol ? this.$route.params.protocol : 'wss'
        return `${protocol}://${this.$route.params.relayUrl}`
    },
    isSingle(){
        return typeof this.$route.params.relayUrl !== 'undefined'
    },
    getUptimeColor(){
        return result => {
            return {
            'text-green-600/100 dark:text-green-600/80': result?.uptime >= 98,
            'text-green-600/80 dark:text-green-400/50': result?.uptime >= 95 && result?.uptime < 98,
            'text-yellow-600 dark:text-yellow-400/90': result?.uptime >= 90 && result?.uptime < 95,
            'text-orange-500': result?.uptime >= 80 && result?.uptime < 90,
            'text-red-400 dark:text-red-600': result?.uptime < 80,
            }
        }
    },
    isFirstVisit(){
        return      (!this.store.jobs.lastUpdate['relays/seed'] && !this.store.prefs.clientSideProcessing)
                ||  ( !this.store.jobs.lastUpdate['relays/check'] && this.store.prefs.clientSideProcessing)
    },
    showBasicData(){
        return this.isFirstVisit && this.store.jobs.getActiveSlug !== 'relays/seed' && !this.pendingFirstCompletion
        // return this.isFirstVisit 
    },
    pendingFirstCompletion(){
        return !this.store.jobs.lastUpdate['relays/seed'] && !this.store.jobs.lastUpdate['relays/check'] && this.$route.path === '/find/relays'
        // return this.isFirstVisit 
    }
}