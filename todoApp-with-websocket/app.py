from flask import Flask
from flask import render_template
import sqlite3
import threading
import websockets
import asyncio
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'


with sqlite3.connect('todo.db') as connection:
    cursor = connection.cursor()
    try:
        cursor.execute(
            '''\
            create table if not exists TODO(
            title text primary key,
            status bool
            );
            '''
        )
        connection.commit()
    except:
        connection.rollback()

async def get_data_from_db():
    result = {
        'type': 'init',
        'message': None,
        'status': True
    }
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        try:
            storage_data = cursor.execute(
                '''\
                select title, status from todo;
                '''
            ).fetchall()
            result['message'] = storage_data
            connection.commit()
        except Exception as e:
            print('传送失败', e)
            result['message'] = []
            connection.rollback()
        finally:
            return result

async def insert_do_db(websocket, message, status):
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        existing = cursor.execute('select title, status from TODO where title=:title', {'title': message}).fetchone()
        print(existing)
        if existing is None:
            try:
                cursor.execute(
                    '''\
                    insert into TODO values (?, ?);
                    ''', (message, False)
                )
                connection.commit()
            except Exception as e:
                print('Insert error', e)
                connection.rollback()
            await websocket.send(json.dumps({
                'message': message,
                'status': False,
                'type': 'add'
            }))
        else:
            await websocket.send(json.dumps({
                'message': message,
                'status': status,
                'type': 'warn'
            }))


async def update_in_db(websocket, message, status):
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        modify_status= 1 if status else 0
        try:
            cursor.execute(
                '''\
                update TODO set status=:status where title=:title
                ''', {'status': modify_status, 'title': message}
            )
            connection.commit()
        except Exception as e:
            print('Modify error', e)
            connection.rollback()
        finally:
            await websocket.send(json.dumps({
                'message': message,
                'status': status,
                'type': 'add'
            }))

async def delete_from_db(message):
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        try:
            cursor.execute(
                '''\
                delete from TODO where title=:title
                ''', {'title': message}
            )
            connection.commit()
        except Exception as e:
            print('Delete error', e)
            connection.rollback()


async def echo(websocket):
    async for message in websocket:
        jsonData = json.loads(message)
        type = jsonData['type']
        message = jsonData['message']
        status = jsonData['status']
        if type == 'init':
            initData = await get_data_from_db()
            await websocket.send(json.dumps(initData))
        elif type == 'add':
            await insert_do_db(websocket, message, status)
        elif type == 'modify':
            await update_in_db(websocket, message, status)
        elif type == 'delete':
            await delete_from_db(message=message)


async def main():
    async with websockets.serve(echo, "localhost", 5012):
        await asyncio.Future()  # run forever



@app.route('/')
def hello_world():  # put application's code here
    return render_template('index.html')



if __name__ == '__main__':
    threading.Thread(target=asyncio.run, args=(main(), )).start()
    Flask.run(app)
