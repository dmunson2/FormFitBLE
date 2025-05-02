import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 5,
  tables: [
    tableSchema({
      name: 'accelData',
      columns: [
        {name: 'x',type: 'number'},
        {name: 'y',type: 'number'},
        {name: 'z',type: 'number'},
        {name: 'primary',type: 'boolean'},
        {name: 'created_at',type: 'number'}
      ]
    }),
    tableSchema({
      name: 'quatData',
      columns: [
        {name: 'x',type: 'number'},
        {name: 'y',type: 'number'},
        {name: 'z',type: 'number'},
        {name: 'w',type: 'number'},
        {name: 'primary',type: 'boolean'},
        {name: 'created_at',type: 'number'}
      ]
    })
  ]
})