
import java.io.File;
import java.io.PrintWriter;
import java.io.FileNotFoundException;
import java.util.*;


public class candidacyChecker {
static public ArrayList<Candidate> Candidates = new ArrayList<>();
static private Candidate new_candidate;
public static void main(String args[])
{
	
	
	try {
		Scanner candidate = new Scanner(new File("candidates.txt"));
		while(candidate.hasNext())
		{
		ArrayList<String> strs = new ArrayList<String>();
		int i = 0 ;
		new_candidate = new Candidate();
		new_candidate.setFirstname(candidate.next());
		for(String ret:candidate.next().split(";") )
		{
			strs.add(ret);
		}
		
		new_candidate.setLastname(strs.get(i));
		new_candidate.setWrittenscore(Integer.parseInt(strs.get(++i)));
		new_candidate.setProgrammingscore(Integer.parseInt(strs.get(++i)));
		new_candidate.setDepartment(strs.get(++i));
		new_candidate.setOrder(Integer.parseInt(strs.get(++i)));
		if(new_candidate.getDepartment().equals(args[0]))
		{
		Candidates.add(new_candidate);
		}
		}
		candidate.close();
	}
		catch (FileNotFoundException e) {
			
			e.printStackTrace();
		}	
	
		bubbleSort(Candidates);
		
		
		
		Collections.reverse(Candidates);
		try{
		    PrintWriter writer = new PrintWriter(args[0]+".txt", "UTF-8");
		    
		    for(Candidate can : Candidates)
			{
		    	writer.println(can.getFirstname() + " " + can.getLastname());
			}
		    writer.close();
		} catch (Exception e) {
		   // do something
		}
		
}

	
public static void bubbleSort(ArrayList<Candidate> candidates) {
    boolean swapped = true;
    int j = 0;
    Candidate tmp = new Candidate();
    while (swapped) {
          swapped = false;
          j++;
          for (int i = 0; i < candidates.size() - j; i++) {  
        	  float diff = (float)Math.abs(candidates.get(i).getTotalscore() - candidates.get(i+1).getTotalscore());
                if (1<(candidates.get(i).getTotalscore()- candidates.get(i+1).getTotalscore())) {                          
                      tmp = candidates.get(i);
                      candidates.set(i,candidates.get(i+1));
                      candidates.set(i+1,tmp);
                      swapped = true;
                }
                
                else if(0<diff && diff<1)
                {
                	if (candidates.get(i).getOrder()< candidates.get(i+1).getOrder()) {                          
                        tmp = candidates.get(i);
                        candidates.set(i,candidates.get(i+1));
                        candidates.set(i+1,tmp);
                        swapped = true;
                  }
                }
          }                
    }
}
/*static int partition(ArrayList<Candidate> candidates, int left, int right)
{
      int i = left, j = right;
      Candidate tmp = new Candidate();
      int pivot = (candidates.size()-1)/2;
     
      while (i <= j) {
            while (candidates.get(i).getTotalscore() < candidates.get(pivot).getTotalscore())
                  i++;
            while (candidates.get(j).getTotalscore() > candidates.get(pivot).getTotalscore())
                  j--;
            if (i <= j) {
            	/*if(candidates.get(i).getTotalscore()  == candidates.get(j).getTotalscore())
            		{
            		if(candidates.get(i).getWrittenscore() > candidates.get(j).getWrittenscore())
            		
            		{
            			tmp = candidates.get(i);
            			candidates.set(i, candidates.get(j));
                        candidates.set(j, tmp);
                        i++;
                        j--;
            		}
            }
            	else{
            		tmp = candidates.get(i);
            		candidates.set(i, candidates.get(j));
            		candidates.set(j, tmp);
            		i++;
            		j--;
            	
            	}
      };
     
      return i;
}*/
 
/*static void quickSort(ArrayList<Candidate> candidates, int left, int right) {
      int index = partition(candidates, left, right);
      if (left < index-1)
            quickSort(candidates, left, index - 1);
      if (index < right)
            quickSort(candidates, index, right);
}*/
}

