use diesel::prelude::*;
use diesel::query_builder::*;
use diesel::query_dsl::methods::LoadQuery;
use diesel::sql_types::BigInt;
use diesel::sqlite::Sqlite;
use serde::Deserialize;
use serde::Serialize;

pub trait Paginate: Sized {
    fn paginate(self, page: i64, size: Option<i64>) -> Paginated<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page: i64, size: Option<i64>) -> Paginated<Self> {
        Paginated {
            query: self,
            page_size: size.unwrap_or(DEFAULT_PER_PAGE),
            page,
            offset: (page - 1) * size.unwrap_or(DEFAULT_PER_PAGE),
        }
    }
}
impl<T> Paginated<T> {
    pub fn load_and_count_pages<'a, U>(self, conn: &mut SqliteConnection) -> QueryResult<Page<U>>
    where
        Self: LoadQuery<'a, SqliteConnection, (U, i64)>,
    {
        let page = self.page.clone();
        let page_size = self.page_size.clone();
        let results = self.load::<(U, i64)>(conn)?;
        let total = results.first().map(|x| x.1).unwrap_or(0);
        let records = results.into_iter().map(|x| x.0).collect();
        let total_count = (total as f64 / page_size as f64).ceil() as i64;

        let page = Page {
            data: records,
            page,
            page_size,
            total_count,
        };

        Ok(page)
    }
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
        out.push_bind_param::<BigInt, _>(&self.page_size)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;
        Ok(())
    }
}

const DEFAULT_PER_PAGE: i64 = 50;

#[derive(Debug, Clone, Copy, QueryId)]
pub struct Paginated<T> {
    query: T,
    page: i64,
    page_size: i64,
    offset: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Page<T> {
    pub data: Vec<T>,
    pub page: i64,
    pub page_size: i64,
    pub total_count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageParams {
    pub page: i64,
    pub page_size: Option<i64>,
}
