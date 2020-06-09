import fs from 'fs'
import path from 'path'

class Media {
  async show(req, res) {
    const { type, subject } = req.query

    fs.readFile(
      path.resolve('src', 'data', 'grades.json'),
      'utf8',
      async (err, data) => {
        try {
          if (err) throw err

          const json = JSON.parse(data)

          const mediaValues = json.grades.reduce((acc, cur) => {
            return cur.type === type && cur.subject === subject
              ? [...acc, cur.value]
              : acc
          }, [])

          if (!mediaValues) {
            res.status(404).send('A média não pôde ser calculada')
          } else {
            const media =
              mediaValues.reduce((acc, cur) => {
                return acc + cur
              }, 0) / mediaValues.length

            res.status(200).json({ media: `${media}` })
          }
        } catch (error) {
          res.status(400).send(error.message)
        }
      },
    )
  }
}

export default new Media()
