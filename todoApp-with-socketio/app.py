from flask import Flask
from flask import render_template
import os
from flask_socketio import SocketIO
from flask_socketio import emit
import sqlite3


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


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



@app.route('/')
def hello_world():  # put application's code here
    return render_template('index.html')


@socketio.on('addtodo')
def handle_title(data):
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        title = data['title']
        status = data['status']
        type = data['type']
        if type == 'add':
            existing = cursor.execute('select title, status from TODO where title=:title', {'title': title}).fetchone()
            print(existing)
            if existing is None:
                try:
                    cursor.execute(
                        '''\
                        insert into TODO values (?, ?);
                        ''', (title, False)
                    )
                    connection.commit()
                except Exception as e:
                    print('Insert error', e)
                    connection.rollback()
                emit('addtodo', {
                    'title': title,
                    'status': False,
                    'type': 'add'
                })
            else:
                emit('addtodo', {
                    'title': title,
                    'status': status,
                    'type': 'warn'
                })
        elif type == 'modify':
            # sqlite3 don't have boolean type value
            modify_status= 1 if status else 0
            try:
                cursor.execute(
                    '''\
                    update TODO set status=:status where title=:title
                    ''', {'status': modify_status, 'title': title}
                )
                connection.commit()
            except Exception as e:
                print('Modify error', e)
                connection.rollback()
            finally:
                emit('addtodo', {
                    'title': title,
                    'status': status,
                    'type': 'add'
                })
        elif type == 'delete':
            try:
                cursor.execute(
                    '''\
                    delete from TODO where title=:title
                    ''', {'title': title}
                )
                connection.commit()
            except Exception as e:
                print('Delete error', e)
                connection.rollback()


@socketio.on('connect')
def sendStorage():
    with sqlite3.connect('todo.db') as connection:
        cursor = connection.cursor()
        try:
            storage_data = cursor.execute(
                '''\
                select title, status from TODO;
                '''
            ).fetchall()
            print(storage_data)
            emit('connect', storage_data)
            connection.commit()
        except Exception as e:
            print('传送失败', e)
            connection.rollback()


if __name__ == '__main__':
    socketio.run(app)
