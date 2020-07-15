// Our Bootstrap JS components
function initBootstrapTooltip() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        $('[data-toggle="tooltip"]').tooltip();
    })
}

function initBootstrapToast() {
    $('.toast').toast('show');
}

// Our VUEJS code
Vue.component('ec2-instances', {
    template: `<div>
    <h4 class="mt-3">
        <i class="fas fa-server"></i>
        {{title}}
        <button type="button" class="btn float-right p-0" v-on:click="fetchData()">
            <i v-if="!loadingData" class="fas fa-redo-alt fa-lg"></i>
            <i v-if="loadingData" class="fas fa-redo-alt fa-lg fa-spin "></i>
        </button>
    </h4>
    <ec2-instance-item v-for="inst in instances" :key="inst.InstanceId" :instance="inst">
    </ec2-instance-item>
    </div>`,
    data: function () {
        return {
            title: 'EC2 Instances',
            instances: [],
            loadingData: true
        }
    },
    mounted() {
        this.fetchData()
        eventBus.$on("refresh-ec2-instances", msg => {
            this.fetchData()
        });
    },
    methods: {
        fetchData: function () {
            this.loadingData = true
            // When we refresh the instances we should mark them as such
            this.instances.forEach(i => i.State = 'Refreshing');
            axios
                .get('/api/instances/ec2')
                .then(response => {
                    this.instances = response.data
                })
                .catch(error => {
                    console.log(error)
                    eventBus.$emit("red-event", "lol");
                })
                .finally(() => {
                    this.loadingData = false
                    initBootstrapTooltip()
                })
        }
    }
})

Vue.component('rds-instances', {
    template: `<div>
    <h4 class="mt-3">
        <i class="fas fa-database"></i>
        {{title}}
        <button type="button" class="btn float-right p-0" v-on:click="fetchData()">
            <i v-if="!loadingData" class="fas fa-redo-alt fa-lg"></i>
            <i v-if="loadingData" class="fas fa-redo-alt fa-lg fa-spin "></i>
        </button>
    </h4>
    <rds-instance-item v-for="inst in instances" :key="inst.DBInstanceIdentifier" :instance="inst">
    </rds-instance-item>
    </div>`,
    data: function () {
        return {
            title: 'RDS Instances',
            instances: [],
            loadingData: true
        }
    },
    mounted() {
        this.fetchData()
        eventBus.$on("refresh-rds-instances", msg => {
            this.fetchData()
        });
    },
    methods: {
        fetchData: function () {
            this.loadingData = true
            // When we refresh the instances we should mark them as such
            this.instances.forEach(i => i.DBInstanceStatus = 'Refreshing');
            axios
                .get('/api/instances/rds')
                .then(response => {
                    this.instances = response.data
                })
                .catch(error => {
                    console.log(error)
                    eventBus.$emit("red-event", "lol");
                })
                .finally(() => {
                    this.loadingData = false
                    initBootstrapTooltip()
                })
        }
    }
})

Vue.component('ec2-instance-item', {
    template: `
    <div class="card mb-3 shadow-sm border-right-0 border-top-0 border-bottom-0 border-left b-thick" :class="classObject">
        <div class="card-body">
        <h5 class="card-title">
            <span data-toggle="tooltip" data-placement="top" :title="instance.State">
                {{instance.Name}}
            </span>
            <small class="text-muted float-right" data-toggle="tooltip" data-placement="top" title="Private Ip Address">
                <i class="fas fa-network-wired"></i>
                <span class="font-weight-bold user-select-all">{{instance.PrivateIpAddress}}</span>
            </small>
        </h5>
        <ec2-instance-actions :instance-id="instance.InstanceId" :instance-state="instance.State" :is-enabled="instance.isInteractive"></ec2-instance-actions>
        <h6 class="card-subtitle mb-2 text-muted">
            <span class="mr-2" data-toggle="tooltip" data-placement="bottom" title="Core count/Threads per core">
                <i class="fas fa-microchip"></i>
                <span>{{instance.CpuOptions.CoreCount}}/{{instance.CpuOptions.ThreadsPerCore}}</span>
            </span>
            <span class="mr-2" data-toggle="tooltip" data-placement="bottom" title="Instance type">
                <i class="fas fa-cube"></i>
                <span>{{instance.InstanceType}}</span>
            </span>
            <span v-if="instance.PublicDnsName.length" data-toggle="tooltip" data-placement="bottom" title="Public DNS">
                <i class="fas fa-globe"></i>
                <span class="user-select-all">{{instance.PublicDnsName}}</span>
            </span>
        </h6>
        </div>
    </div>
    `,
    props: ['instance'],
    computed: {
        // We need this to update when data is refreshed
        classObject: function () {
            return {
                'bg-lightish': !this.instance.isInteractive,
                'border-success': this.instance.State === "running",
                'border-danger': this.instance.State === "stopped",
            }
        }
    }
})

Vue.component('rds-instance-item', {
    template: `
    <div class="card mb-3 shadow-sm border-right-0 border-top-0 border-bottom-0 border-left b-thick" :class="classObject">
        <div class="card-body">
        <h5 class="card-title">
            <span data-toggle="tooltip" data-placement="top" :title="instance.DBInstanceStatus">
                {{instance.DBInstanceIdentifier}}
            </span>
            <small class="text-muted float-right" data-toggle="tooltip" data-placement="top" title="DB Engine">
                <i class="fas fa-cogs"></i>
                <span class="font-weight-bold">{{instance.Engine}}</span>
            </small>
        </h5>
        <rds-instance-actions :instance-id="instance.DBInstanceIdentifier" :instance-state="instance.DBInstanceStatus" :is-enabled="instance.isInteractive"></rds-instance-actions>
        <h6 class="card-subtitle mb-2 text-muted">
            <span class="mr-2" data-toggle="tooltip" data-placement="bottom" title="Storage size">
                <i class="fas fa-hdd"></i>
                <span>{{instance.AllocatedStorage}}</span>
            </span>
            <span class="mr-2" data-toggle="tooltip" data-placement="bottom" title="Instance type">
                <i class="fas fa-cube"></i>
                <span>{{instance.DBInstanceClass}}</span>
            </span>
            <span v-if="instance.Endpoint.length" data-toggle="tooltip" data-placement="bottom" title="Public DNS">
                <i class="fas fa-globe"></i>
                <span class="user-select-all">{{instance.Endpoint}}</span>
            </span>
        </h6>
        </div>
    </div>
    `,
    props: ['instance'],
    computed: {
        // We need this to update when data is refreshed
        classObject: function () {
            return {
                'bg-lightish': !this.instance.isInteractive,
                'border-success': this.instance.DBInstanceStatus === "available",
                'border-danger': this.instance.DBInstanceStatus === "stopped",
            }
        }
    }
})

Vue.component('ec2-instance-actions', {
    template: `
        <button type="button" class="btn float-right p-0" v-bind:disabled="!isEnabled || changingState || isUnknown" v-on:click="changeState()">
            <i class="far fa-clock fa-2x" :class="classObject"
            data-toggle="tooltip" data-placement="bottom" :title="title"></i>
        </button>
    `,
    props: ['instanceId', 'instanceState', 'isEnabled'],
    data: function () {
        return {
            changingState: false,
        }
    },
    computed: {
        // a computed getter
        isRunning: function () {
            // `this` points to the vm instance
            return this.instanceState === 'running';
        },
        isStopped: function () {
            // `this` points to the vm instance
            return this.instanceState === 'stopped';
        },
        isUnknown: function () {
            return this.instanceState !== 'running' && this.instanceState !== 'stopped';
        },
        title: function () {
            if (this.isStopped) {
                return 'Start Instance';
            } else if (this.isRunning) {
                return 'Stop Instance';
            } else if (this.isUnknown) {
                return 'State: ' + this.instanceState;
            }
            return 'Processing...';
        },
        // We need this to update when data is refreshed
        classObject: function () {
            return {
                'fa-play-circle': this.isStopped && !this.changingState,
                'fa-stop-circle': this.isRunning && !this.changingState,
                'fa-question-circle': this.isUnknown && !this.changingState,
                'fa-clock': this.changingState,
            }
        }
    },
    methods: {
        changeState: function () {
            this.changingState = true
            axios
                .put(`/api/instances/ec2/${this.instanceId}`, {
                    desiredOperation: this.isRunning ? "STOP" : this.isStopped ? "START" : "UNKNOWN"
                })
                .then(response => {
                    eventBus.$emit("green-event", response.data || "Operation successful.");
                    eventBus.$emit("refresh-ec2-instances");
                })
                .catch(error => {
                    eventBus.$emit("red-event", error.response.data.message || "An error occurred");
                })
                .finally(() => {
                    this.changingState = false
                })
        }
    }
})

Vue.component('rds-instance-actions', {
    template: `
        <button type="button" class="btn float-right p-0" v-bind:disabled="!isEnabled || changingState || isUnknown" v-on:click="changeState()">
            <i class="far fa-clock fa-2x" :class="classObject"
            data-toggle="tooltip" data-placement="bottom" :title="title"></i>
        </button>
    `,
    props: ['instanceId', 'instanceState', 'isEnabled'],
    data: function () {
        return {
            changingState: false
        }
    },
    computed: {
        // a computed getter
        isRunning: function () {
            // `this` points to the vm instance
            return this.instanceState === 'available';
        },
        isStopped: function () {
            // `this` points to the vm instance
            return this.instanceState === 'stopped';
        },
        isUnknown: function () {
            return this.instanceState !== 'available' && this.instanceState !== 'stopped';
        },
        title: function () {
            if (this.isStopped) {
                return 'Start Instance';
            } else if (this.isRunning) {
                return 'Stop Instance';
            } else if (this.isUnknown) {
                return 'State: ' + this.instanceState;
            }
            return 'Processing...';
        },
        // We need this to update when data is refreshed
        classObject: function () {
            return {
                'fa-play-circle': this.isStopped && !this.changingState,
                'fa-stop-circle': this.isRunning && !this.changingState,
                'fa-question-circle': this.isUnknown && !this.changingState,
                'fa-clock': this.changingState,
            }
        }
    },
    methods: {
        changeState: function () {
            this.changingState = true
            axios
                .put(`/api/instances/rds/${this.instanceId}`, {
                    desiredOperation: this.isRunning ? "STOP" : this.isStopped ? "START" : "UNKNOWN"
                })
                .then(response => {
                    eventBus.$emit("green-event", response.data || "Operation successful.");
                    eventBus.$emit("refresh-rds-instances");
                })
                .catch(error => {
                    eventBus.$emit("red-event", error.response.data.message || "An error occurred");
                })
                .finally(() => {
                    this.changingState = false
                })
        }
    }
})

Vue.component('notifications', {
    template: `
        <div v-show="message" style="position: fixed; bottom: 1rem; right: 1rem;">
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
                <div class="toast-body alert-success" :class="{'alert-danger':isError}">
                {{message}}
                </div>
            </div>
        </div>`,
    data: function () {
        return {
            message: null,
            isError: false
        }
    },
    mounted() {
        initBootstrapToast();

        eventBus.$on("green-event", msg => {
            this.message = msg;
            this.isError = false;
            initBootstrapToast()
        });
        eventBus.$on("red-event", msg => {
            this.message = msg;
            this.isError = true;
            initBootstrapToast()
        });
    }
})
// We will use this to share data between components
// https://medium.com/@kashifazmi94/sharing-data-between-component-in-vue-js-acfd71e05815
const eventBus = new Vue();
// Initialize our VUE app
var app = new Vue({
    el: '#theApp'
})