module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
            cloud_name: 'dvosfhyof',
            api_key: '223883866316725',
            api_secret: 'sBODpn6IiLd-qp0uEY8wLTou7m0',
          },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  });