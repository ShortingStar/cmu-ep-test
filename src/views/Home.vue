<template>
  <v-card class="mx-auto" outlined>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card-title>
            <v-btn @click="onAdd" color="primary">
              Add Employee
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
          >
            <template v-slot:item.operation="{ item }">
              <v-btn @click="onUpdate(item._id)" color="success" class="ma-1"
                >Update</v-btn
              >
              <v-btn @click="onDelete(item._id)" color="error" class="ma-1"
                >Delete</v-btn
              >
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" persistent width="480px">
        <v-card>
          <v-form v-model="formValid" @submit.prevent="onSubmit" ref="form">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.firstname"
                      :rules="rules.required"
                      label="First name"
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.lastname"
                      :rules="rules.required"
                      label="Last name"
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <!-- <v-text-field
                      v-model="form.birthday"
                      :rules="rules.required"
                      label="Birthday"
                      dense
                      required
                    ></v-text-field> -->

                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="form.birthday"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.birthday"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="form.birthday" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(form.birthday)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.email"
                      :rules="rules.emailRequired"
                      label="Email"
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="onClose">Close</v-btn>
              <v-btn type="submit" color="primary" text>Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Firstname',
          align: 'left',
          value: 'firstname'
        },
        {
          text: 'Lastname',
          value: 'lastname'
        },
        {
          text: 'Birthday',
          value: 'birthday'
        },
        {
          text: 'Email',
          value: 'email'
        },
        {
          text: 'Operation',
          value: 'operation'
        }
      ],
      items: [],
      formTitle: '',
      form: {
        firstname: '',
        lastname: '',
        birthday: new Date().toISOString().substr(0, 10),
        email: ''
      },
      formValid: false,
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      rules: {
        required: [v => !!v || 'This field is Required.'],
        emailRequired: [
          v => !!v || 'This field is Required.',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ]
      }
    }
  },

  watch: {
    dialog(value) {
      if (!value) {
        this.onResetDialog()
      }
    }
  },

  async mounted() {
    const result = await this.apiAction('employee/getEmployees')
    this.items = result.data
  },

  methods: {
    async apiAction(target, payload) {
      this.loading = true
      try {
        let res = null
        if (!payload) {
          res = await this.$store.dispatch(target)
        } else {
          res = await this.$store.dispatch(target, payload)
        }
        return res
      } catch (e) {
        alert(e)
      } finally {
        this.loading = false
      }
    },

    onAdd() {
      this.formTitle = 'Add Employee'
      this.form = {
        firstname: '',
        lastname: '',
        birthday: new Date().toISOString().substr(0, 10),
        email: ''
      }
      this.dialog = true
    },

    onUpdate(id) {
      this.formTitle = 'Edit Employee'
      const selectedForm = this.items.find(item => {
        return item._id === id
      })
      this.form = JSON.parse(JSON.stringify(selectedForm))
      this.dialog = true
    },

    onResetDialog() {
      this.$refs.form.resetValidation()
      this.form = {
        firstname: '',
        lastname: '',
        birthday: new Date().toISOString().substr(0, 10),
        email: ''
      }
    },

    async onSubmit() {
      if (this.formValid) {
        if (this.form._id) {
          const body = {
            id: this.form._id,
            body: {
              firstname: this.form.firstname,
              lastname: this.form.lastname,
              birthday: this.form.birthday,
              email: this.form.email
            }
          }
          await this.apiAction('employee/putEmployees', body)
        } else {
          await this.apiAction('employee/postEmployees', this.form)
        }
        const result = await this.apiAction('employee/getEmployees')
        this.items = result.data
        this.dialog = false
        this.onResetDialog()
      } else {
        this.$refs.form.validate()
      }
    },

    onClose() {
      this.dialog = false
      this.onResetDialog()
    },

    async onDelete(id) {
      if (confirm('delete?')) {
        await this.apiAction('employee/deleteEmployees', id)
        const result = await this.apiAction('employee/getEmployees')
        this.items = result.data
      }
    }
  }
}
</script>
