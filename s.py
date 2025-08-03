#! /usr/bin/env python3
print("Hello world")



def find_path(matrix,row,col):
    cash = [[0]*col for _ in range(row)]
    for i in range(row):
        cash[i][0]=matrix[i][0]
   
    
    # for i in cash:
    #     print(i)
    for c in range(1,col):
        for r in range(row):
            if r == 0:
                val1 = matrix[r][c] + cash[row-1][c-1]
                val2 = matrix[r][c] + cash[r][c-1]
                val3 = matrix[r][c] + cash[r+1][c-1]
                cash[r][c] = min(val1,val2,val3)
            elif r == row-1:
                val1 = matrix[r][c] + cash[r-1][c-1]
                val2 = matrix[r][c] + cash[r][c-1]
                val3 = matrix[r][c] + cash[0][c-1]
                cash[r][c] = min(val1,val2,val3)
            else:
                val1 = matrix[r][c] + cash[r-1][c-1]
                val2 = matrix[r][c] + cash[r][c-1]
                val3 = matrix[r][c] + cash[r+1][c-1]
                cash[r][c] = min(val1,val2,val3)
    for i in cash:
        print(i)
    dist = float("inf")
    min_r = 0
    for r in range(row):
        if dist>=cash[r][col-1]:
            dist = cash[r][col-1]
            min_r=r
    
    def dfs(i):
        if i == 0:
            return
        


    
    print(dist,min_r)


row,col=5,6
matrix=[
    [3, 4, 1, 2, 8, 6],
    [6, 1, 8, 2, 7, 4],
    [5, 9, 3, 9, 9, 5],
    [8, 4, 1, 3, 2, 6],
    [3, 7, 2, 8, 6, 4]
]

find_path(matrix,row,col)