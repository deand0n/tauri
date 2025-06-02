// use diesel::expression::QueryMetadata;
// use diesel::prelude::*;
// use diesel::query_builder::*;
// use diesel::query_dsl::methods::LoadQuery;
// use diesel::sql_types::BigInt;
// use diesel::sql_types::HasSqlType;
// use diesel::sqlite::Sqlite;
// use diesel::SqliteConnection;
// use serde::{Deserialize, Serialize};

// pub trait Paginate: Sized {
//     fn paginate(self, page: i64, size: Option<i64>) -> Paginated<Self>;
// }

// impl<T> Paginate for T {
//     fn paginate(self, page: i64, size: Option<i64>) -> Paginated<Self> {
//         Paginated {
//             query: self,
//             page_size: size.unwrap_or(DEFAULT_PER_PAGE),
//             page,
//             offset: (page - 1) * size.unwrap_or(DEFAULT_PER_PAGE),
//         }
//     }
// }

// const DEFAULT_PER_PAGE: i64 = 20;

// #[derive(Debug, Clone, Copy, QueryId, Deserialize, Serialize)]
// pub struct Paginated<T> {
//     query: T,
//     page: i64,
//     page_size: i64,
//     offset: i64,
// }

// impl<T: Query> Query for Paginated<T> {
//     type SqlType = (T::SqlType, BigInt);
// }

// impl<T> RunQueryDsl<SqliteConnection> for Paginated<T> {}

// impl<T> QueryFragment<Sqlite> for Paginated<T>
// where
//     T: QueryFragment<Sqlite>,
// {
//     fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Sqlite>) -> QueryResult<()> {
//         out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
//         self.query.walk_ast(out.reborrow())?;
//         out.push_sql(") t LIMIT ");
//         out.push_bind_param::<BigInt, _>(&self.page_size)?;
//         out.push_sql(" OFFSET ");
//         out.push_bind_param::<BigInt, _>(&self.offset)?;
//         Ok(())
//     }
// }

// //

// impl<T: diesel::query_builder::Query> Paginated<T>
// where
//     Sqlite: QueryMetadata<(
//         (<T as diesel::query_builder::Query>::SqlType, BigInt),
//         BigInt,
//     )>,
// {
//     pub fn page_size(self, page_size: i64) -> Self {
//         Paginated { page_size, ..self }
//     }

//     pub fn load_and_count_pages<'a, U>(
//         self,
//         conn: &mut SqliteConnection,
//     ) -> QueryResult<(Vec<U>, i64)>
//     where
//         Self: LoadQuery<'a, SqliteConnection, (U, i64)>,
//     {
//         let page_size = self.page_size;
//         let results = self.load::<(U, i64)>(conn)?;
//         let total = results.get(0).map(|x| x.1).unwrap_or(0);
//         let records = results.into_iter().map(|x| x.0).collect();
//         let total_pages = (total as f64 / page_size as f64).ceil() as i64;
//         Ok((records, total_pages))
//     }

//     fn load_with_pagination<U>(
//         self,
//         conn: &mut SqliteConnection,
//         page: Option<i64>,
//         page_size: Option<i64>,
//     ) -> QueryResult<(Vec<U>, i64)> {
//         let (records, total_pages) = match page {
//             Some(page) => {
//                 let mut query = self.paginate(page, page_size);
//                 if let Some(page_size) = page_size {
//                     query = query.page_size(page_size);
//                 }

//                 query.load_and_count_pages(conn)?
//             }
//             None => (self.load::<U>(conn)?, 1),
//         };

//         Ok((records, total_pages))
//     }
// }

use diesel::prelude::*;
use diesel::query_builder::*;
use diesel::query_dsl::methods::LoadQuery;
use diesel::sql_types::BigInt;
use diesel::sqlite::Sqlite;

pub trait Paginate: Sized {
    fn paginate(self, page: i64) -> Paginated<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page: i64) -> Paginated<Self> {
        Paginated {
            query: self,
            per_page: DEFAULT_PER_PAGE,
            page,
            offset: (page - 1) * DEFAULT_PER_PAGE,
        }
    }
}

const DEFAULT_PER_PAGE: i64 = 10;

#[derive(Debug, Clone, Copy, QueryId)]
pub struct Paginated<T> {
    query: T,
    page: i64,
    per_page: i64,
    offset: i64,
}

impl<T> Paginated<T> {
    pub fn per_page(self, per_page: i64) -> Self {
        Paginated {
            per_page,
            offset: (self.page - 1) * per_page,
            ..self
        }
    }

    pub fn load_and_count_pages<'a, U>(
        self,
        conn: &mut SqliteConnection,
    ) -> QueryResult<(Vec<U>, i64)>
    where
        Self: LoadQuery<'a, SqliteConnection, (U, i64)>,
    {
        let per_page = self.per_page;
        let results = self.load::<(U, i64)>(conn)?;
        let total = results.first().map(|x| x.1).unwrap_or(0);
        let records = results.into_iter().map(|x| x.0).collect();
        let total_pages = (total as f64 / per_page as f64).ceil() as i64;
        Ok((records, total_pages))
    }

    // fn load_with_pagination<U>(
    //     self,
    //     conn: &mut SqliteConnection,
    //     page: Option<i64>,
    //     page_size: Option<i64>,
    // ) -> QueryResult<(Vec<U>, i64)> {
    //     let (records, total_pages) = match page {
    //         Some(page) => {
    //             let mut query = self;
    //             if let Some(page_size) = page_size {
    //                 query = query.per_page(page_size);
    //             }

    //             query.load_and_count_pages::<U>(conn)?
    //         }
    //         None => (self.load::<U>(conn)?, 1),
    //     };

    //     Ok((records, total_pages))
    // }
}

impl<T: Query> Query for Paginated<T> {
    type SqlType = (T::SqlType, BigInt);
}

impl<T> RunQueryDsl<SqliteConnection> for Paginated<T> {}

impl<T> QueryFragment<Sqlite> for Paginated<T>
where
    T: QueryFragment<Sqlite>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Sqlite>) -> QueryResult<()> {
        out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(") t LIMIT ");
        out.push_bind_param::<BigInt, _>(&self.per_page)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;
        Ok(())
    }
}
