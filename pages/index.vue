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
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="address"
                      label="Any address cosmos"
                      :rules="[required, isBech32]"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </v-card-text>
        <v-card-actions class="justify-center">
 
          <v-btn
            :disabled="!form"
            class="mb-3"
            elevation="2"
            large
            x-large
            @click="onSubmit"
          >
            Convert address
          </v-btn>
        </v-card-actions>
      </v-card>

      <template>
         
  <v-simple-table  class="mt-6" dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Chain name
          </th>
          <th class="text-left">
            Your address
          </th>
          <th class="text-left">
            Type
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in addressList"
          :key="index"
        >
          <td>{{ item[0] }}</td>
          <td>{{ item[1] }}</td>
          <td>
            <v-chip
              v-if="item[2] === 'mainnet'"
              class="ma-2"
              color="green"
              outlined
            >
              {{ item[2] }}
            </v-chip>            
            <v-chip
              v-else
              class="ma-2"
              color="orange"
              outlined
            >
              {{ item[2] }}
            </v-chip>              
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

    </v-col>
  </v-row>
</template>

<script>
let { bech32 } = require('bech32')
import { assets, chains, ibc } from 'chain-registry'


export default {
  data() {
    return {
      form: false,
      address: null,
      loading: false,
      addressList: [],
    }
  },

  methods: {
    onSubmit() {    
      let decode = bech32.decode(this.address)

      for (const key in chains) {
        console.log(chains[key].network_type)
        this.addressList.push([
          chains[key].chain_name, 
          bech32.encode(chains[key].bech32_prefix, decode.words),
          chains[key].network_type
        ])
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
      return !!this.testIsBech32(v) || 'Is not bech32'
    },    
  },
}
</script>
