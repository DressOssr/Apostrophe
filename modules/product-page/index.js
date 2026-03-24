export default {
  extend: '@apostrophecms/piece-page-type',

  options: {
    label: 'project:productPage',
    perPage: 12
  },

  fields: {
    add: {
      _displayCategory: {
        type: 'relationship',
        label: 'Display Category',
        withType: 'product-category',
        max: 1
      }
    },
    group: {
      basics: {
        fields: [ 'title', '_displayCategory', 'slug', 'visibility' ]
      }
    }
  },

  methods(self) {
    return {
      async beforeIndex(req) {
        req.data.categoryOptions = await self.apos.productCategory
          .find(req)
          .project({
            _id: 1,
            title: 1
          })
          .sort({ title: 1 })
          .toArray();

        req.data.selectedCategoryId = req.query._category || '';
      },

      indexQuery(req) {
        const query = self.pieces
          .find(req, {})
          .applyBuildersSafely(req.query)
          .perPage(self.options.perPage || 12);

        if (req.query._category) {
          query._category(req.query._category);
        } else {
          self.filterByIndexPage(query, req.data.page);
        }

        return query;
      },

      filterByIndexPage(query, page) {
        if (page.displayCategoryIds && page.displayCategoryIds.length) {
          query._category(page.displayCategoryIds[0]);
        }

        return query;
      }
    };
  },
  extendMethods(self) {
    return {
      chooseParentPage(_super, pages, piece) {
        const pieceCategoryId = Array.isArray(piece.categoryIds) && piece.categoryIds.length
          ? piece.categoryIds[0]
          : null;

        if (pieceCategoryId && pages.length > 1) {
          return (
            pages.find((page) =>
              Array.isArray(page.displayCategoryIds) &&
              page.displayCategoryIds[0] === pieceCategoryId
            ) ||
            _super(pages, piece)
          );
        }

        return _super(pages, piece);
      }
    };
  }
};
