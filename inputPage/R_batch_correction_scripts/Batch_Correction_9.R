source("https://bioconductor.org/biocLite.R")
biocLite("NOISeq")
library(NOISeq)
var <- commandArgs(trailingOnly = TRUE)
MyData <- read.csv(sprintf("%s/no_batch_big_df.csv",var), header = T, skip = 1)[-c(1)]
SampleIDs <- read.csv(sprintf("%s/no_batch_big_df.csv",var), nrows=1)
ENS_IDs <- read.csv(sprintf("%s/no_batch_big_df.csv",var), header = T, skip =1)[c(1)]
MyData$X0 <- NULL 
MyData$ID <- NULL
row.names(MyData) <- MyData$Associated
MyData$Associated <- NULL

One <- MyData[,grepl("G1",colnames(MyData))] 
Two <- MyData[,grepl("G2",colnames(MyData))]
Three <- MyData[,grepl("G3",colnames(MyData))]
Four <- MyData[,grepl("G4",colnames(MyData))]
Five <- MyData[,grepl("G5",colnames(MyData))]
Six <- MyData[,grepl("G6",colnames(MyData))]
Seven <- MyData[,grepl("G7",colnames(MyData))]
Eight <- MyData[,grepl("G8",colnames(MyData))]
Nine <- MyData[,grepl("G9",colnames(MyData))]
MyData <- cbind(One, Two, Three, Four, Five, Six, Seven, Eight, Nine)

Group1 <- grep("G1",names(MyData), value= T)
Group1 <- as.matrix(Group1)
Group1 <-gsub("G1", "Group1", Group1)
Group2 <- grep("G2",names(MyData), value= T)
Group2 <- as.matrix(Group2)
Group2 <-gsub("G2", "Group2", Group2)
Group3 <- grep("G3",names(MyData), value= T)
Group3 <- as.matrix(Group3)
Group3 <-gsub("G3", "Group3", Group3)
Group4 <- grep("G4",names(MyData), value= T)
Group4 <- as.matrix(Group4)
Group4 <-gsub("G4", "Group4", Group4)
Group5 <- grep("G5",names(MyData), value= T)
Group5 <- as.matrix(Group5)
Group5 <-gsub("G5", "Group5", Group5)
Group6 <- grep("G6",names(MyData), value= T)
Group6 <- as.matrix(Group6)
Group6 <-gsub("G6", "Group6", Group6)
Group7 <- grep("G7",names(MyData), value= T)
Group7 <- as.matrix(Group7)
Group7 <-gsub("G7", "Group7", Group7)
Group8 <- grep("G8",names(MyData), value= T)
Group8 <- as.matrix(Group8)
Group8 <-gsub("G8", "Group8", Group8)
Group9 <- grep("G9",names(MyData), value= T)
Group9 <- as.matrix(Group9)
Group9 <-gsub("G9", "Group9", Group9)
condition <- rbind(Group1, Group2, Group3, Group4, Group5, Group6, Group7, Group8, Group9)
condition <- sub("\\..*$", "", condition)
myfactor <- data.frame(condition)
rawdata <- readData(data=MyData, factors=myfactor)
batchcorrdata <- ARSyNseq(rawdata, factor ="condition", batch=FALSE, norm="n", logtransf=FALSE)
write.csv(batchcorrdata, file = sprintf("%s/R Corrected Input.csv",var))
write.csv(rawdata, file =sprintf("%s/R Raw Input.csv",var))
write.csv(ENS_IDs, file =sprintf("%s/ENS IDs.csv",var))
write.csv(SampleIDs, file=sprintf("%s/Sample IDs.csv",var))


