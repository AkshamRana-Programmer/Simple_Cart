const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '003Cart API',
            version: '1.0.0',
            description: 'API documentation for users and products endpoints'
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Local development server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '69dd5cb17d6c957c831c3b73'
                        },
                        name: {
                            type: 'string',
                            example: 'Rohit Sharma'
                        },
                        email: {
                            type: 'string',
                            example: 'rohit@gmail.com'
                        },
                        password: {
                            type: 'string',
                            example: 'Rohit@123'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['id', 'title', 'price', 'category', 'description', 'thumbnail'],
                    properties: {
                        _id: {
                            type: 'string',
                            example: '69dd5cb17d6c957c831c3b80'
                        },
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        title: {
                            type: 'string',
                            example: 'Essence Mascara Lash Princess'
                        },
                        price: {
                            type: 'number',
                            example: 9.99
                        },
                        category: {
                            type: 'string',
                            example: 'beauty'
                        },
                        description: {
                            type: 'string',
                            example: 'Popular mascara known for volumizing and lengthening effects.'
                        },
                        thumbnail: {
                            type: 'string',
                            example: 'https://example.com/image.webp'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);
