<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">

      <v-card class="mt-4">
        <v-card-title class="headline">
          Cosmos address convertor
        </v-card-title>
        <v-card-text>
          <template>
            <v-form v-model="form">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="address" label="Any address cosmos" :rules="[required, isBech32]" required
                      outlined></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </v-card-text>
        <v-card-actions class="justify-center">

          <v-btn :disabled="!form" class="mb-3" elevation="2" large x-large @click="onSubmit">
            Convert address
          </v-btn>
        </v-card-actions>
      </v-card>

      <template>

        <v-row justify="center" class="mt-6 mb-6">
          <v-expansion-panels>
            <v-expansion-panel v-for="(item, index) in addressList" :key="index" @click="checkAmount(item[1])">
              <v-expansion-panel-header v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="4" class="text-capitalize">
                    <v-avatar class="mr-6">
                      <img :src="item[3]" :alt="item[0]">
                    </v-avatar>

                    {{ item[0] }}
                  </v-col>
                  <v-col cols="8" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <span v-if="open">{{ item[1] }}</span>
                      <v-row v-else no-gutters style="width: 100%">
                        <v-col cols="6" class="mt-4">
                          {{ item[1] }}
                        </v-col>
                        <v-col cols="6">

                        </v-col>
                      </v-row>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content> 

                <v-progress-linear
                  v-if="!dataLoaded"
                  color="deep-purple accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
 
                <v-simple-table v-if="amountToken.length > 0 && dataLoaded">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          amount
                        </th>
                        <th class="text-left">
                          denom
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in amountToken"
                        :key="item.denom"
                      >
                        <td>{{ item.amount }}</td>
                        <td>{{ item.denom }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>                
                <v-alert
                  v-else
                  text
                  color="info"
                >
                  <h3 class="text-h5">
                    No token found
                  </h3> 
                  <v-divider
                    class="my-4 info"
                    style="opacity: 0.22"
                  ></v-divider>
                  <v-row
                    align="center"
                    no-gutters
                  >
                    <v-col class="grow">
                      If you want to load your wallet with tokens, please go to the original site of {{ item[0] }}                      
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="shrink"> 
                      {{ item[4] }} 
                    </v-col>
                  </v-row>
                </v-alert>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </template>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
let { bech32 } = require('bech32')
import { assets, chains } from 'chain-registry'

export default {
  data() {
    return {
      form: false,
      address: '',
      loading: false,
      addressList: [],
      amountToken: [],
      dataLoaded: false
    }
  },

  methods: {
    onSubmit() {
      let decode = bech32.decode(this.address)

      for (const key in chains) {
        const assetList = assets.find(({ chain_name }) => chain_name === chains[key].chain_name)
        const chainsList = chains.find(({ chain_name }) => chain_name === chains[key].chain_name)

        if (typeof assetList?.assets[0].logo_URIs?.png !== 'undefined') {
          if (chains[key].network_type !== 'testnet' && chains[key].status === 'live') {
            this.addressList.push([
              chains[key].chain_name,
              bech32.encode(chains[key].bech32_prefix, decode.words),
              chains[key].network_type,
              assetList?.assets[0].logo_URIs?.png,
              chainsList?.website
            ])
          }
        }
      }
    },
    testIsBech32() {
      try {
        bech32.decode(this.address)
        return true
      } catch (e) {
        return false
      }
    },
    required(v) {
      return !!v || 'Field is required'
    },
    isBech32(v) {
      return !!this.testIsBech32(v) || 'This address is not bech32'
    },
    async checkAmount(address) {
      this.dataLoaded = false
      this.amountToken = []

      let tokenBalance = await axios.get('/cosmos-api/get-balances?address=' + address)
      this.amountToken = tokenBalance.data.balances
      this.dataLoaded = true
      console.log(tokenBalance.data)
    }
  },
}
</script>
