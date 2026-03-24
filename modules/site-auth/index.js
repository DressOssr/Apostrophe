export default {
  options: {
    alias: 'siteAuth',
    csrfExceptions: [ '/auth/login', '/auth/register', '/auth/logout' ]
  },

  methods(self) {
    return {
      buildRedirectUrl(path, params = {}) {
        const search = new URLSearchParams();

        Object.entries(params).forEach(([ key, value ]) => {
          if (value) {
            search.set(key, value);
          }
        });

        const query = search.toString();
        return query ? `${path}?${query}` : path;
      },

      getSafeNextUrl(value, fallback = '/') {
        const next = self.apos.launder.string(value || '');

        if (!next || !next.startsWith('/') || next.startsWith('//')) {
          return fallback;
        }

        return next;
      },

      getAuthErrorMessage(error, fallback) {
        if (error?.message && typeof error.message === 'string') {
          return error.message;
        }

        return fallback;
      }
    };
  },

  routes(self) {
    return {
      post: {
        '/auth/login': async (req, res) => {
          if (req.user) {
            return res.redirect('/');
          }

          const username = self.apos.launder.string(req.body.username || '');
          const password = self.apos.launder.string(req.body.password || '');
          const next = self.getSafeNextUrl(req.body.next);

          if (!username || !password) {
            return res.redirect(self.buildRedirectUrl('/sign-in', {
              error: 'Username or email and password are required.'
            }));
          }

          req.body = {
            ...req.body,
            username,
            password,
            session: true
          };

          try {
            await self.apos.login.initialLogin(req);
            return res.redirect(next);
          } catch (error) {
            return res.redirect(self.buildRedirectUrl('/sign-in', {
              error: self.getAuthErrorMessage(error, 'Unable to sign in.')
            }));
          }
        },

        '/auth/register': async (req, res) => {
          if (req.user) {
            return res.redirect('/');
          }

          const username = self.apos.login.normalizeLoginName(
            self.apos.launder.string(req.body.username || '')
          );
          const email = self.apos.login.normalizeLoginName(
            self.apos.launder.string(req.body.email || '')
          );
          const password = self.apos.launder.string(req.body.password || '');
          const confirmPassword = self.apos.launder.string(req.body.confirmPassword || '');
          const next = self.getSafeNextUrl(req.body.next);
          const adminReq = self.apos.task.getAdminReq({
            locale: req.locale,
            aposLocale: req.aposLocale
          });

          if (!username || !email || !password || !confirmPassword) {
            return res.redirect(self.buildRedirectUrl('/sign-up', {
              error: 'All fields are required.'
            }));
          }

          if (password !== confirmPassword) {
            return res.redirect(self.buildRedirectUrl('/sign-up', {
              error: 'Passwords do not match.'
            }));
          }

          const existingUser = await self.apos.user.find(adminReq, {
            $or: [
              { username },
              { email }
            ]
          }).toObject();

          if (existingUser) {
            return res.redirect(self.buildRedirectUrl('/sign-up', {
              error: 'A user with that username or email already exists.'
            }));
          }

          try {
            await self.apos.user.insert(adminReq, {
              title: username,
              username,
              email,
              password,
              role: 'guest'
            });

            req.body = {
              username,
              password,
              session: true
            };

            await self.apos.login.initialLogin(req);

            return res.redirect(next);
          } catch (error) {
            return res.redirect(self.buildRedirectUrl('/sign-up', {
              error: self.getAuthErrorMessage(error, 'Unable to create account.')
            }));
          }
        },

        '/auth/logout': async (req, res) => {
          if (req.user && req.session) {
            await new Promise((resolve, reject) => {
              req.session.destroy((error) => {
                if (error) {
                  return reject(error);
                }

                return resolve();
              });
            });
          }

          return res.redirect('/');
        }
      }
    };
  }
};
