import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError


class Connection:
    def __init__(self, conn_string):
        self.engine = create_engine(conn_string)

    def get_tables(self):
        return self.execute(
            "select table_name FROM information_schema.tables WHERE table_schema='public'"
        )

    def execute(self, sql, args={}):  # args should be{'name':'value'} dictionary
        try:
            return pd.read_sql(sql, self.engine, params=args)
        except ProgrammingError as e:
            print(e)

    def raw_execute(self, sql, args=(), commit=True):
        with self.engine.connect() as connection:
            with connection.begin():
                try:
                    res = connection.execute(text(sql))
                    if res.returns_rows:
                        df = pd.DataFrame(res.fetchall())
                        df.columns = res.keys()
                        return df
                except ProgrammingError as e:
                    print(e)
